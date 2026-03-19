import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  Habit,
  HabitLog,
  HabitDifficulty,
} from '../../infra/entities/habit.entity';
import { CreateHabitDto } from '../../infra/dtos/create-habit.dto';
import { UpdateHabitDto } from '../../infra/dtos/update-habit.dto';

@Injectable()
export class HabitsService {
  constructor(
    @InjectRepository(Habit)
    private readonly habitRepository: Repository<Habit>,
    @InjectRepository(HabitLog)
    private readonly habitLogRepository: Repository<HabitLog>,
  ) {}

  private calculateXP(difficulty: HabitDifficulty): number {
    switch (difficulty) {
      case HabitDifficulty.EASY:
        return 10;
      case HabitDifficulty.MEDIUM:
        return 25;
      case HabitDifficulty.HARD:
        return 50;
      case HabitDifficulty.EPIC:
        return 100;
      default:
        return 10;
    }
  }

  async create(userId: string, createHabitDto: CreateHabitDto): Promise<Habit> {
    const habit = this.habitRepository.create({
      ...createHabitDto,
      user: { id: userId } as Habit['user'],
    });
    return this.habitRepository.save(habit);
  }

  async findAll(userId: string): Promise<Habit[]> {
    return this.habitRepository.find({
      where: { user: { id: userId } },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(userId: string, id: string): Promise<Habit> {
    const habit = await this.habitRepository.findOne({
      where: { id, user: { id: userId } },
    });

    if (!habit) {
      throw new NotFoundException(`Habit with ID ${id} not found`);
    }
    return habit;
  }

  async update(
    userId: string,
    id: string,
    updateHabitDto: UpdateHabitDto,
  ): Promise<Habit> {
    const habit = await this.findOne(userId, id);
    this.habitRepository.merge(habit, updateHabitDto);
    return this.habitRepository.save(habit);
  }

  async remove(userId: string, id: string): Promise<void> {
    const habit = await this.findOne(userId, id);
    await this.habitRepository.remove(habit);
  }

  async completeHabit(
    userId: string,
    id: string,
  ): Promise<{ xpEarned: number; streak: number }> {
    const habit = await this.findOne(userId, id);
    const today = new Date();

    // Verifica se já completou hoje
    const todayStr = today.toISOString().split('T')[0];
    const alreadyCompleted = await this.habitLogRepository
      .createQueryBuilder('log')
      .where('log.habit_id = :habitId', { habitId: id })
      .andWhere('DATE(log.date) = :date', { date: todayStr })
      .getOne();

    if (alreadyCompleted) {
      // Já completou hoje, não ganha XP extra (ou ganha reduzido? por enquanto 0)
      return { xpEarned: 0, streak: habit.streak };
    }

    const xp = this.calculateXP(habit.difficulty);

    // Registra log
    const log = this.habitLogRepository.create({
      habit,
      date: today,
      xp_earned: xp,
    });
    await this.habitLogRepository.save(log);

    // Atualiza hábito (streak + xp total)
    // TODO: Lógica de quebra de streak se falhar um dia
    habit.streak += 1;
    habit.total_xp += xp;
    await this.habitRepository.save(habit);

    return { xpEarned: xp, streak: habit.streak };
  }
}
