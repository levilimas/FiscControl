import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Goal } from '../../infra/entities/goal.entity';
import {
  Transaction,
  TransactionType,
} from '../../../transactions/infra/entities/transaction.entity';
import { CreateGoalDto } from '../../infra/dtos/create-goal.dto';
import { UpdateGoalDto } from '../../infra/dtos/update-goal.dto';

export interface GoalProgress {
  goal: Goal;
  spent: number;
  remaining: number;
  percentage: number;
}

@Injectable()
export class GoalsService {
  constructor(
    @InjectRepository(Goal)
    private readonly goalRepository: Repository<Goal>,
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
  ) {}

  async create(userId: string, dto: CreateGoalDto): Promise<Goal> {
    const existing = await this.goalRepository.findOne({
      where: {
        userId,
        categoryId: dto.categoryId,
        month: dto.month,
        year: dto.year,
      },
    });

    if (existing) {
      throw new ConflictException(
        'Goal already exists for this category and period',
      );
    }

    const goal = this.goalRepository.create({
      ...dto,
      userId,
    });

    return this.goalRepository.save(goal);
  }

  async findAll(
    userId: string,
    month: number,
    year: number,
  ): Promise<GoalProgress[]> {
    const goals = await this.goalRepository.find({
      where: { userId, month, year },
      relations: ['category'],
      order: { amount: 'DESC' },
    });

    // Calcular progresso para cada meta
    const progressPromises = goals.map(async (goal) => {
      // Definir intervalo de datas para o mês
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0, 23, 59, 59, 999);

      // Somar transações de DESPESA da categoria neste período
      const transactions = await this.transactionRepository.find({
        where: {
          account: { userId },
          categoryId: goal.categoryId,
          type: TransactionType.EXPENSE,
          date: Between(startDate, endDate),
        },
      });

      const spent = transactions.reduce((sum, t) => sum + Number(t.amount), 0);
      const remaining = Number(goal.amount) - spent;
      const percentage = Math.min((spent / Number(goal.amount)) * 100, 100);

      return {
        goal,
        spent,
        remaining,
        percentage,
      };
    });

    return Promise.all(progressPromises);
  }

  async findOne(userId: string, id: string): Promise<Goal> {
    const goal = await this.goalRepository.findOne({
      where: { id, userId },
      relations: ['category'],
    });

    if (!goal) {
      throw new NotFoundException('Goal not found');
    }

    return goal;
  }

  async update(userId: string, id: string, dto: UpdateGoalDto): Promise<Goal> {
    const goal = await this.findOne(userId, id);
    this.goalRepository.merge(goal, dto);
    return this.goalRepository.save(goal);
  }

  async remove(userId: string, id: string): Promise<void> {
    const goal = await this.findOne(userId, id);
    await this.goalRepository.remove(goal);
  }
}
