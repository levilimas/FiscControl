import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from '../transactions/infra/entities/transaction.entity';
import { Account } from '../accounts/infra/entities/account.entity';
import { ReportsService } from './application/services/reports.service';
import { ReportsController } from './application/controllers/reports.controller';
import { ExchangeRatesModule } from '../exchange-rates/exchange-rates.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Transaction, Account]),
    ExchangeRatesModule,
  ],
  controllers: [ReportsController],
  providers: [ReportsService],
})
export class ReportsModule {}
