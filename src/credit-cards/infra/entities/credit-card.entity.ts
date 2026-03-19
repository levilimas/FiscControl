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

@Entity('credit_cards')
export class CreditCard {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ name: 'user_id' })
  userId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  limit: number;

  @Column({ name: 'closing_day' })
  closingDay: number; // 1-31

  @Column({ name: 'due_day' })
  dueDay: number; // 1-31

  @OneToMany(() => Transaction, (transaction) => transaction.creditCard)
  transactions: Transaction[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
