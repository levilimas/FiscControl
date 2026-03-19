import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Account } from '../../../accounts/infra/entities/account.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ name: 'password_hash' })
  passwordHash: string;

  @Column()
  name: string;

  @Column({ nullable: true, type: 'varchar', length: 14 })
  cpf: string | null;

  @Column({ nullable: true, type: 'varchar', length: 20 })
  phone: string | null;

  @Column({ name: 'birth_date', type: 'date', nullable: true })
  birthDate: Date | null;

  @Column({ name: 'terms_accepted_at', type: 'timestamp', nullable: true })
  termsAcceptedAt: Date | null;

  @Column({
    name: 'privacy_policy_accepted_at',
    type: 'timestamp',
    nullable: true,
  })
  privacyPolicyAcceptedAt: Date | null;

  @Column({
    type: 'jsonb',
    default: () =>
      `'{"default_context":"PF","notification_enabled":true,"theme":"light"}'`,
  })
  preferences: Record<string, unknown>;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ name: 'last_login', type: 'timestamp', nullable: true })
  lastLogin: Date | null;

  @Column({ name: 'two_factor_secret', nullable: true })
  twoFactorSecret: string | null;

  @Column({ name: 'is_two_factor_enabled', default: false })
  isTwoFactorEnabled: boolean;

  @OneToMany(() => Account, (account) => account.user)
  accounts: Account[];
}
