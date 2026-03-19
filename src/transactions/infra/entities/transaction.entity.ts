import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Account } from '../../../accounts/infra/entities/account.entity';

import { Category } from '../../../categories/infra/entities/category.entity';
import { CreditCard } from '../../../credit-cards/infra/entities/credit-card.entity';
import { Tag } from '../../../tags/infra/entities/tag.entity';

export enum TransactionType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE',
}

export enum TransactionStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
}

@Entity('transactions')
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'account_id', nullable: true }) // Nullable se for crédito
  accountId: string;

  @ManyToOne(() => Account, (account) => account.transactions, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinColumn({ name: 'account_id' })
  account: Account;

  @Column({ name: 'credit_card_id', nullable: true })
  creditCardId: string;

  @ManyToOne(() => CreditCard, (card) => card.transactions, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinColumn({ name: 'credit_card_id' })
  creditCard: CreditCard;

  @Column({ name: 'installment_number', nullable: true })
  installmentNumber: number; // 1, 2, 3...

  @Column({ name: 'total_installments', nullable: true })
  totalInstallments: number; // 10, 12...

  @Column({
    type: 'enum',
    enum: TransactionType,
  })
  type: TransactionType;

  @Column({
    type: 'decimal',
    precision: 15,
    scale: 2,
  })
  amount: number;

  @Column()
  description: string;

  @Column({ nullable: true })
  category: string; // Mantido por compatibilidade, mas deprecated

  @Column({ name: 'category_id', nullable: true })
  categoryId: string;

  @Column({ name: 'external_id', nullable: true })
  externalId: string;

  @ManyToOne(() => Category, (category) => category.transactions, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'category_id' })
  categoryRelation: Category;

  @Column({ type: 'timestamp' })
  date: Date;

  @ManyToMany(() => Tag, (tag) => tag.transactions)
  @JoinTable({
    name: 'transaction_tags',
    joinColumn: { name: 'transaction_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'tag_id', referencedColumnName: 'id' },
  })
  tags: Tag[];

  @Column({
    type: 'enum',
    enum: TransactionStatus,
    default: TransactionStatus.COMPLETED,
  })
  status: TransactionStatus;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
