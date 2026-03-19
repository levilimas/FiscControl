import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../../users/infra/entities/user.entity';
import { Transaction } from '../../../transactions/infra/entities/transaction.entity';

export enum AccountType {
  CORRENTE = 'CORRENTE',
  POUPANCA = 'POUPANCA',
  INVESTIMENTO = 'INVESTIMENTO',
  OUTRO = 'OUTRO',
}

@Entity('accounts')
export class Account {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id' })
  userId: string;

  @ManyToOne(() => User, (user) => user.accounts, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => Transaction, (transaction) => transaction.account)
  transactions: Transaction[];

  @Column()
  name: string;

  @Column({ name: 'bank_name', type: 'varchar', length: 255, nullable: true })
  bankName: string | null;

  @Column({
    type: 'enum',
    enum: AccountType,
    default: AccountType.CORRENTE,
    name: 'account_type',
  })
  accountType: AccountType;

  @Column({
    name: 'initial_balance',
    type: 'decimal',
    precision: 15,
    scale: 2,
    default: 0,
  })
  initialBalance: number;

  @Column({
    name: 'current_balance',
    type: 'decimal',
    precision: 15,
    scale: 2,
    default: 0,
  })
  currentBalance: number;

  @Column({ default: 'BRL' })
  currency: string;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
