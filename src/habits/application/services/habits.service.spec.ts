import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { HabitsService } from './habits.service';
import { Habit, HabitLog } from '../../infra/entities/habit.entity';

describe('HabitsService', () => {
  let service: HabitsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HabitsService,
        {
          provide: getRepositoryToken(Habit),
          useValue: {},
        },
        {
          provide: getRepositoryToken(HabitLog),
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<HabitsService>(HabitsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
