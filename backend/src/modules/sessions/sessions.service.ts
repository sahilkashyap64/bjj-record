import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { SessionLog } from '../../entities/session-log.entity';
import { Round } from '../../entities/round.entity';
import { CreateSessionDto, UpdateSessionDto } from './dto';

@Injectable()
export class SessionsService {
  constructor(
    @InjectRepository(SessionLog)
    private sessionRepository: Repository<SessionLog>,
    @InjectRepository(Round)
    private roundRepository: Repository<Round>,
  ) {}

  async create(userId: string, dto: CreateSessionDto): Promise<SessionLog> {
    const session = this.sessionRepository.create({
      user_id: userId,
      ...dto,
    });
    return this.sessionRepository.save(session);
  }

  async findMany(userId: string, options?: { from?: string; to?: string; limit?: number }) {
    const query = this.sessionRepository
      .createQueryBuilder('session')
      .where('session.user_id = :userId', { userId })
      .orderBy('session.created_at', 'DESC');

    if (options?.from) {
      query.andWhere('session.created_at >= :from', { from: options.from });
    }
    if (options?.to) {
      query.andWhere('session.created_at <= :to', { to: options.to });
    }
    if (options?.limit) {
      query.limit(options.limit);
    }

    return query.getMany();
  }

  async findById(sessionId: string, userId: string): Promise<SessionLog | null> {
    return this.sessionRepository.findOne({
      where: { id: sessionId, user_id: userId },
      relations: ['rounds', 'rounds.actions'],
    });
  }

  async update(
    sessionId: string,
    userId: string,
    dto: UpdateSessionDto,
  ): Promise<SessionLog> {
    await this.sessionRepository.update(
      { id: sessionId, user_id: userId },
      dto,
    );
    return this.findById(sessionId, userId);
  }

  async delete(sessionId: string, userId: string): Promise<void> {
    await this.sessionRepository.delete({
      id: sessionId,
      user_id: userId,
    });
  }
}
