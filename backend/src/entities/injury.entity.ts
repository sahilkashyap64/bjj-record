import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from './user.entity';

@Entity('injuries')
@Index(['user_id', 'status'])
export class Injury {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  user_id: string;

  @ManyToOne(() => User, (user) => user.injuries, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  body_part: string;

  @Column()
  severity: 'minor' | 'moderate' | 'severe';

  @Column({ nullable: true })
  notes: string;

  @Column({ default: 'active' })
  status: 'active' | 'healing' | 'resolved';

  @Column({ type: 'date' })
  occurred_date: Date;

  @Column({ type: 'date', nullable: true })
  resolved_date: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
