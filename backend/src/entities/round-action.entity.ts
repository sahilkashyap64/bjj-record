import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Round } from './round.entity';

@Entity('round_actions')
export class RoundAction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  round_id: string;

  @ManyToOne(() => Round, (round) => round.actions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'round_id' })
  round: Round;

  @Column()
  action_type:
    | 'escape'
    | 'pass_defense'
    | 'submission_attempt'
    | 'submission_finish'
    | 'takedown'
    | 'sweep'
    | 'KPI_event';

  @Column()
  result: 'success' | 'failure' | 'neutral';

  @Column({ nullable: true })
  technique_id: string;

  @Column({ nullable: true })
  notes: string;

  @CreateDateColumn()
  created_at: Date;
}
