import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'users' })
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index({ unique: true })
  @Column({ type: 'bigint', name: 'tg_id' })
  tgId!: string;

  @Column({ type: 'text', name: 'username', nullable: true })
  username!: string | null;

  @Column({
    type: 'text',
    name: 'timezone',
    nullable: false,
    default: 'Europe/Moscow',
  })
  timezone!: string;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt!: Date;
}
