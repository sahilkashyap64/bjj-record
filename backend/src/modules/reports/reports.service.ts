import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { SessionLog } from '../../entities/session-log.entity';
import { RoundAction } from '../../entities/round-action.entity';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(SessionLog)
    private sessionRepository: Repository<SessionLog>,
    @InjectRepository(RoundAction)
    private actionRepository: Repository<RoundAction>,
  ) {}

  async getWeeklyReport(userId: string, weekStart: string) {
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 7);

    const sessions = await this.sessionRepository
      .createQueryBuilder('s')
      .where('s.user_id = :userId', { userId })
      .andWhere('s.created_at >= :weekStart', { weekStart })
      .andWhere('s.created_at < :weekEnd', { weekEnd })
      .leftJoinAndSelect('s.rounds', 'r')
      .leftJoinAndSelect('r.actions', 'a')
      .getMany();

    const totalDuration = sessions.reduce((sum, s) => sum + s.duration_min, 0);
    const totalLoad = sessions.reduce((sum, s) => sum + s.duration_min * s.sRPE, 0);

    const kpis = this.calculateKPIs(sessions);

    return {
      week_start: weekStart,
      sessions_count: sessions.length,
      total_duration_min: totalDuration,
      total_load: totalLoad,
      average_sRPE: sessions.length > 0 ? 
        sessions.reduce((sum, s) => sum + s.sRPE, 0) / sessions.length : 0,
      kpis,
    };
  }

  async getMonthlyReport(userId: string, month: string) {
    const [year, monthNum] = month.split('-').map(Number);
    const startDate = new Date(year, monthNum - 1, 1);
    const endDate = new Date(year, monthNum, 1);

    const sessions = await this.sessionRepository
      .createQueryBuilder('s')
      .where('s.user_id = :userId', { userId })
      .andWhere('s.created_at >= :startDate', { startDate })
      .andWhere('s.created_at < :endDate', { endDate })
      .leftJoinAndSelect('s.rounds', 'r')
      .leftJoinAndSelect('r.actions', 'a')
      .getMany();

    const totalDuration = sessions.reduce((sum, s) => sum + s.duration_min, 0);
    const totalLoad = sessions.reduce((sum, s) => sum + s.duration_min * s.sRPE, 0);

    const kpis = this.calculateKPIs(sessions);

    return {
      month,
      sessions_count: sessions.length,
      total_duration_min: totalDuration,
      total_load: totalLoad,
      average_sRPE: sessions.length > 0 ?
        sessions.reduce((sum, s) => sum + s.sRPE, 0) / sessions.length : 0,
      kpis,
    };
  }

  private calculateKPIs(sessions: SessionLog[]) {
    const allActions = sessions.flatMap(s => s.rounds?.flatMap(r => r.actions) || []);

    const escapeAttempts = allActions.filter(a => a.action_type === 'escape');
    const escapeRate = escapeAttempts.length > 0 ?
      escapeAttempts.filter(a => a.result === 'success').length / escapeAttempts.length : 0;

    const passDefenses = allActions.filter(a => a.action_type === 'pass_defense');
    const passDefenseRate = passDefenses.length > 0 ?
      passDefenses.filter(a => a.result === 'success').length / passDefenses.length : 0;

    const submissionAttempts = allActions.filter(a =>
      ['submission_attempt', 'submission_finish'].includes(a.action_type)
    );
    const submissionFinishes = allActions.filter(a => a.action_type === 'submission_finish');
    const submissionRate = submissionAttempts.length > 0 ?
      submissionFinishes.length / submissionAttempts.length : 0;

    return {
      escape_rate: parseFloat(escapeRate.toFixed(2)),
      guard_pass_defense_rate: parseFloat(passDefenseRate.toFixed(2)),
      submission_finish_rate: parseFloat(submissionRate.toFixed(2)),
    };
  }
}
