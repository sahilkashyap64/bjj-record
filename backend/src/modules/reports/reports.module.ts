import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SessionLog } from '../../entities/session-log.entity';
import { RoundAction } from '../../entities/round-action.entity';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';

@Module({
  imports: [TypeOrmModule.forFeature([SessionLog, RoundAction])],
  controllers: [ReportsController],
  providers: [ReportsService],
})
export class ReportsModule {}
