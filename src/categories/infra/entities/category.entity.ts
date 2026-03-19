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

export enum CategoryType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE',
}

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({
    type: 'enum',
    enum: CategoryType,
  })
  type: CategoryType;

  @Column({ name: 'user_id' })
  userId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => Transaction, (transaction) => transaction.categoryRelation)
  transactions: Transaction[];

  @Column({ nullable: true })
  icon: string; // Para o frontend usar ícones (ex: 'mdi-food')

  @Column({ nullable: true })
  color: string; // Para gráficos (ex: '#FF0000')

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
