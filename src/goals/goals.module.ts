import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Goal } from './infra/entities/goal.entity';
import { GoalsService } from './application/services/goals.service';
import { GoalsController } from './application/controllers/goals.controller';
import { Transaction } from '../transactions/infra/entities/transaction.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Goal, Transaction])],
  controllers: [GoalsController],
  providers: [GoalsService],
  exports: [GoalsService],
})
export class GoalsModule {}
