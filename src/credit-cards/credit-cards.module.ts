import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreditCard } from './infra/entities/credit-card.entity';
import { CreditCardsService } from './application/services/credit-cards.service';
import { CreditCardsController } from './application/controllers/credit-cards.controller';
import { Transaction } from '../transactions/infra/entities/transaction.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CreditCard, Transaction])],
  controllers: [CreditCardsController],
  providers: [CreditCardsService],
  exports: [CreditCardsService],
})
export class CreditCardsModule {}
