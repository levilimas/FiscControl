import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HabitsController } from './application/controllers/habits.controller';
import { HabitsService } from './application/services/habits.service';
import { Habit, HabitLog } from './infra/entities/habit.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Habit, HabitLog])],
  controllers: [HabitsController],
  providers: [HabitsService],
  exports: [HabitsService],
})
export class HabitsModule {}
