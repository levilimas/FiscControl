import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './database/typeorm.config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { AccountsModule } from './accounts/accounts.module';
import { TransactionsModule } from './transactions/transactions.module';
import { CategoriesModule } from './categories/categories.module';
import { GoalsModule } from './goals/goals.module';
import { CreditCardsModule } from './credit-cards/credit-cards.module';
import { ImportsModule } from './imports/imports.module';
import { ReportsModule } from './reports/reports.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TagsModule } from './tags/tags.module';
import { HabitsModule } from './habits/habits.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync(typeOrmConfig),
    UsersModule,
    AuthModule,
    AccountsModule,
    TransactionsModule,
    CategoriesModule,
    GoalsModule,
    CreditCardsModule,
    ImportsModule,
    ReportsModule,
    TagsModule,
    HabitsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
