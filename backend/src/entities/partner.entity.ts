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

@Entity('partners')
@Index(['user_id', 'status'])
export class Partner {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  user_id: string;

  @ManyToOne(() => User, (user) => user.partners, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  pseudonym: string;

  @Column({ nullable: true })
  real_name: string;

  @Column({ nullable: true })
  belt_level: string;

  @Column({ type: 'decimal', precision: 3, scale: 1, nullable: true })
  average_weight: number;

  @Column({ default: 'active' })
  status: 'active' | 'inactive' | 'archived';

  @Column('jsonb', { nullable: true })
  metadata: Record<string, any>;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
