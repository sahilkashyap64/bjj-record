import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SessionLog } from '../../entities/session-log.entity';
import { SyncService } from './sync.service';
import { SyncController } from './sync.controller';

@Module({
  imports: [TypeOrmModule.forFeature([SessionLog])],
  controllers: [SyncController],
  providers: [SyncService],
})
export class SyncModule {}
