import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { SessionLog } from './session-log.entity';
import { RoundAction } from './round-action.entity';

@Entity('rounds')
export class Round {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  session_log_id: string;

  @ManyToOne(() => SessionLog, (session) => session.rounds, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'session_log_id' })
  session_log: SessionLog;

  @Column({ nullable: true })
  partner_id: string;

  @Column({ type: 'int' })
  round_number: number;

  @Column({ type: 'int' })
  duration_sec: number;

  @Column({ default: 'other' })
  position: 'guard' | 'mount' | 'side_control' | 'back' | 'neutral' | 'other';

  @Column('jsonb', { nullable: true })
  notes: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => RoundAction, (action) => action.round)
  actions: RoundAction[];
}
