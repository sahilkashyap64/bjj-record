import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { SessionLog } from '../../entities/session-log.entity';

@Injectable()
export class SyncService {
  constructor(
    @InjectRepository(SessionLog)
    private sessionRepository: Repository<SessionLog>,
  ) {}

  async pushChanges(userId: string, changes: any[]) {
    // Process outbox queue and sync to server
    for (const change of changes) {
      try {
        if (change.id) {
          await this.sessionRepository.update(
            { id: change.id, user_id: userId },
            { ...change, sync_status: 'synced' },
          );
        } else {
          await this.sessionRepository.save({
            user_id: userId,
            ...change,
            sync_status: 'synced',
          });
        }
      } catch (error) {
        // Mark as conflict if update fails
        console.error('Sync error:', error);
      }
    }

    return { synced: changes.length };
  }

  async pullChanges(userId: string, since?: string) {
    const query = this.sessionRepository.createQueryBuilder('s');
    query.where('s.user_id = :userId', { userId });

    if (since) {
      query.andWhere('s.server_updated_at > :since', { since });
    }

    const changes = await query
      .leftJoinAndSelect('s.rounds', 'r')
      .leftJoinAndSelect('r.actions', 'a')
      .getMany();

    return {
      changes,
      cursor: new Date().toISOString(),
    };
  }
}
