import 'reflect-metadata';
import 'dotenv/config';
import { DataSource } from 'typeorm';
import { User } from '../users/infra/entities/user.entity';
import { Account } from '../accounts/infra/entities/account.entity';
import { Transaction } from '../transactions/infra/entities/transaction.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [User, Account, Transaction],
  migrations: ['migrations/*.ts'],
  synchronize: false,
});
