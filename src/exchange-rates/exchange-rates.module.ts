import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ExchangeRatesService } from './application/services/exchange-rates.service';

@Module({
  imports: [HttpModule],
  providers: [ExchangeRatesService],
  exports: [ExchangeRatesService],
})
export class ExchangeRatesModule {}
