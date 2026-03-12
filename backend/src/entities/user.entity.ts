import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { SessionLog } from './session-log.entity';
import { Partner } from './partner.entity';
import { Injury } from './injury.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  display_name: string;

  @Column({ default: 'active' })
  status: 'active' | 'archived' | 'deleted';

  @Column('jsonb', { nullable: true })
  preferences: {
    default_gi?: boolean;
    default_duration_min?: number;
    default_sRPE?: number;
  };

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => SessionLog, (session) => session.user)
  sessions: SessionLog[];

  @OneToMany(() => Partner, (partner) => partner.user)
  partners: Partner[];

  @OneToMany(() => Injury, (injury) => injury.user)
  injuries: Injury[];
}
