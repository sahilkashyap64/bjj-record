export interface User {
  id: string;
  email: string;
  displayName?: string;
}

export interface SessionLog {
  id: string;
  userId: string;
  durationMin: number;
  sRPE: number;
  sessionType: 'drilling' | 'open_mat' | 'competition' | 'class' | 'other';
  gi: boolean;
  createdAt: string;
  rounds: Round[];
  syncStatus: 'pending' | 'synced' | 'conflict';
}

export interface Round {
  id: string;
  sessionLogId: string;
  partnerId?: string;
  roundNumber: number;
  durationSec: number;
  position: 'guard' | 'mount' | 'side_control' | 'back' | 'neutral' | 'other';
  notes?: string;
  actions: RoundAction[];
}

export interface RoundAction {
  id: string;
  roundId: string;
  actionType: 'escape' | 'pass_defense' | 'submission_attempt' | 'submission_finish' | 'takedown' | 'sweep';
  result: 'success' | 'failure' | 'neutral';
  techniqueId?: string;
  notes?: string;
  createdAt: string;
}

export interface Partner {
  id: string;
  pseudonym: string;
  realName?: string;
  beltLevel?: string;
  averageWeight?: number;
  status: 'active' | 'inactive' | 'archived';
}

export interface Technique {
  id: string;
  name: string;
  category: 'escape' | 'guard_pass' | 'guard_defense' | 'submission' | 'takedown' | 'sweep' | 'position' | 'other';
  description?: string;
  custom: boolean;
}

export interface Injury {
  id: string;
  bodyPart: string;
  severity: 'minor' | 'moderate' | 'severe';
  notes?: string;
  status: 'active' | 'healing' | 'resolved';
  occurredDate: string;
  resolvedDate?: string;
}

export interface WeeklyReport {
  weekStart: string;
  sessionsCount: number;
  totalDurationMin: number;
  totalLoad: number;
  averageSRPE: number;
  kpis: KPIs;
}

export interface MonthlyReport {
  month: string;
  sessionsCount: number;
  totalDurationMin: number;
  totalLoad: number;
  averageSRPE: number;
  kpis: KPIs;
}

export interface KPIs {
  escapeRate: number;
  guardPassDefenseRate: number;
  submissionFinishRate: number;
}
