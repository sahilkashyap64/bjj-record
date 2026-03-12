import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from './user.entity';
import { Round } from './round.entity';

@Entity('session_logs')
@Index(['user_id', 'created_at'])
export class SessionLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  user_id: string;

  @ManyToOne(() => User, (user) => user.sessions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  duration_min: number;

  @Column('decimal', { precision: 3, scale: 1 })
  sRPE: number;

  @Column({ default: 'other' })
  session_type: 'drilling' | 'open_mat' | 'competition' | 'class' | 'other';

  @Column({ default: true })
  gi: boolean;

  @Column('jsonb', { nullable: true })
  metadata: Record<string, any>;

  @Column({ default: 'synced' })
  sync_status: 'pending' | 'synced' | 'conflict';

  @Column({ nullable: true })
  device_id: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  server_updated_at: Date;

  @OneToMany(() => Round, (round) => round.session_log)
  rounds: Round[];
}
