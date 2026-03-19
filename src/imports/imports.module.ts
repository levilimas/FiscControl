import { Module } from '@nestjs/common';
import { ImportsService } from './application/services/imports.service';
import { ImportsController } from './application/controllers/imports.controller';
import { TransactionsModule } from '../transactions/transactions.module';
import { CategoriesModule } from '../categories/categories.module';
import { AccountsModule } from '../accounts/accounts.module';

@Module({
  imports: [TransactionsModule, CategoriesModule, AccountsModule],
  controllers: [ImportsController],
  providers: [ImportsService],
})
export class ImportsModule {}
