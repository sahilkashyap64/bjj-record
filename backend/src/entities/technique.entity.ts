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

@Entity('techniques')
@Index(['user_id', 'category'])
export class Technique {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  user_id: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  name: string;

  @Column()
  category:
    | 'escape'
    | 'guard_pass'
    | 'guard_defense'
    | 'submission'
    | 'takedown'
    | 'sweep'
    | 'position'
    | 'other';

  @Column({ nullable: true })
  description: string;

  @Column({ default: true })
  custom: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
