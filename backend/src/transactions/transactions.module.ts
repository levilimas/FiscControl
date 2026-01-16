import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from '../accounts/infra/entities/account.entity';
import { TransactionsController } from './application/controllers/transactions.controller';
import { TransactionsService } from './application/services/transactions.service';
import { Transaction } from './infra/entities/transaction.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Transaction, Account])],
  controllers: [TransactionsController],
  providers: [TransactionsService],
  exports: [TransactionsService],
})
export class TransactionsModule {}
