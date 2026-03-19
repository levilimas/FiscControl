import 'reflect-metadata';
import 'dotenv/config';
import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { User } from '../users/infra/entities/user.entity';
import { Account } from '../accounts/infra/entities/account.entity';
import { Transaction } from '../transactions/infra/entities/transaction.entity';
import { Category } from '../categories/infra/entities/category.entity';
import { Goal } from '../goals/infra/entities/goal.entity';
import { CreditCard } from '../credit-cards/infra/entities/credit-card.entity';
import { Tag } from '../tags/infra/entities/tag.entity';
import { Habit, HabitLog } from '../habits/infra/entities/habit.entity';

export const typeOrmConfig: TypeOrmModuleAsyncOptions = {
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => ({
    type: 'postgres',
    url: configService.get<string>('DATABASE_URL'),
    entities: [
      User,
      Account,
      Transaction,
      Category,
      Goal,
      CreditCard,
      Tag,
      Habit,
      HabitLog,
    ],
    migrations: ['dist/migrations/*.js'],
    autoLoadEntities: true,
    synchronize: false,
  }),
};

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [
    User,
    Account,
    Transaction,
    Category,
    Goal,
    CreditCard,
    Tag,
    Habit,
    HabitLog,
  ],
  migrations: ['migrations/*.ts'],
  synchronize: false,
});
