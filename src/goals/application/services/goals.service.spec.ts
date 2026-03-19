import { Test, TestingModule } from '@nestjs/testing';
import { GoalsService } from './goals.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Goal } from '../../infra/entities/goal.entity';
import { Transaction } from '../../../transactions/infra/entities/transaction.entity';
import { ConflictException } from '@nestjs/common';

describe('GoalsService', () => {
  let service: GoalsService;

  const mockUser = { userId: 'user-id' };
  const mockGoal = {
    id: 'goal-id',
    userId: mockUser.userId,
    categoryId: 'category-id',
    amount: 1000,
    month: 10,
    year: 2023,
    category: { id: 'category-id', name: 'Food' },
  } as Goal;

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
  };

  const mockTransactionRepository = {
    find: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GoalsService,
        {
          provide: getRepositoryToken(Goal),
          useValue: mockRepository,
        },
        {
          provide: getRepositoryToken(Transaction),
          useValue: mockTransactionRepository,
        },
      ],
    }).compile();

    service = module.get<GoalsService>(GoalsService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a goal', async () => {
      mockRepository.findOne.mockResolvedValue(null);
      mockRepository.create.mockReturnValue(mockGoal);
      mockRepository.save.mockResolvedValue(mockGoal);

      const result = await service.create(mockUser.userId, {
        categoryId: 'category-id',
        amount: 1000,
        month: 10,
        year: 2023,
      });

      expect(result).toEqual(mockGoal);
      expect(mockRepository.save).toHaveBeenCalled();
    });

    it('should throw ConflictException if goal exists', async () => {
      mockRepository.findOne.mockResolvedValue(mockGoal);

      await expect(
        service.create(mockUser.userId, {
          categoryId: 'category-id',
          amount: 1000,
          month: 10,
          year: 2023,
        }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('findAll', () => {
    it('should return goals with progress', async () => {
      mockRepository.find.mockResolvedValue([mockGoal]);
      // Mock transactions to calculate spent
      // Total spent: 200
      mockTransactionRepository.find.mockResolvedValue([
        { amount: 100 },
        { amount: 100 },
      ]);

      const result = await service.findAll(mockUser.userId, 10, 2023);

      expect(result).toHaveLength(1);
      expect(result[0].goal).toEqual(mockGoal);
      expect(result[0].spent).toBe(200);
      expect(result[0].remaining).toBe(800); // 1000 - 200
      expect(result[0].percentage).toBe(20); // (200/1000)*100
    });
  });
});
