import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { UserEntity } from '@/modules/user/entities/user.entity';

export enum ECheckInStatus {
  DONE = 'DONE',
  SKIPPED = 'SKIPPED',
}

@Entity({ name: 'check_ins' })
@Index(['userId', 'checkInDate'], { unique: true })
export class CheckInEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid', name: 'user_id' })
  userId!: string;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: UserEntity;

  // Важно: именно DATE, чтобы "один чек-ин на день"
  @Column({ type: 'date', name: 'check_in_date' })
  checkInDate!: string; // YYYY-MM-DD

  @Column({ type: 'enum', enum: ECheckInStatus, name: 'status' })
  status!: ECheckInStatus;

  @Column({ type: 'text', name: 'note', nullable: true })
  note!: string | null;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt!: Date;
}
