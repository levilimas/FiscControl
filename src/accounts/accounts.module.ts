import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountsController } from './application/controllers/accounts.controller';
import { AccountsService } from './application/services/accounts.service';
import { Account } from './infra/entities/account.entity';
import { ExchangeRatesModule } from '../exchange-rates/exchange-rates.module';

@Module({
  imports: [TypeOrmModule.forFeature([Account]), ExchangeRatesModule],
  controllers: [AccountsController],
  providers: [AccountsService],
  exports: [AccountsService],
})
export class AccountsModule {}
