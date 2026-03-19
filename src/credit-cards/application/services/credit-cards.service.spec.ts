import { Test, TestingModule } from '@nestjs/testing';
import { CreditCardsService } from './credit-cards.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreditCard } from '../../infra/entities/credit-card.entity';
import { Transaction } from '../../../transactions/infra/entities/transaction.entity';
import { NotFoundException } from '@nestjs/common';

describe('CreditCardsService', () => {
  let service: CreditCardsService;

  const mockUser = { userId: 'user-id' };
  const mockCard = {
    id: 'card-id',
    userId: mockUser.userId,
    name: 'Test Card',
    limit: 1000,
    closingDay: 10,
    dueDay: 17,
  } as CreditCard;

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    merge: jest.fn(),
    remove: jest.fn(),
  };

  const mockTransactionQueryBuilder = {
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    getMany: jest.fn().mockResolvedValue([]),
  };

  const mockTransactionRepository = {
    createQueryBuilder: jest.fn(() => mockTransactionQueryBuilder),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreditCardsService,
        {
          provide: getRepositoryToken(CreditCard),
          useValue: mockRepository,
        },
        {
          provide: getRepositoryToken(Transaction),
          useValue: mockTransactionRepository,
        },
      ],
    }).compile();

    service = module.get<CreditCardsService>(CreditCardsService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a credit card', async () => {
      mockRepository.create.mockReturnValue(mockCard);
      mockRepository.save.mockResolvedValue(mockCard);

      const result = await service.create(mockUser.userId, {
        name: 'Test Card',
        limit: 1000,
        closingDay: 10,
        dueDay: 17,
      });

      expect(result).toEqual(mockCard);
      expect(mockRepository.create).toHaveBeenCalled();
      expect(mockRepository.save).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return array of cards', async () => {
      mockRepository.find.mockResolvedValue([mockCard]);

      const result = await service.findAll(mockUser.userId);

      expect(result).toEqual([mockCard]);
      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { userId: mockUser.userId },
        order: { name: 'ASC' },
      });
    });
  });

  describe('findOne', () => {
    it('should return a card', async () => {
      mockRepository.findOne.mockResolvedValue(mockCard);

      const result = await service.findOne(mockUser.userId, 'card-id');

      expect(result).toEqual(mockCard);
    });

    it('should throw NotFoundException', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(
        service.findOne(mockUser.userId, 'invalid-id'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a card', async () => {
      mockRepository.findOne.mockResolvedValue(mockCard);
      mockRepository.save.mockResolvedValue({ ...mockCard, name: 'Updated' });

      const result = await service.update(mockUser.userId, 'card-id', {
        name: 'Updated',
      });

      expect(result.name).toBe('Updated');
      expect(mockRepository.merge).toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should remove a card', async () => {
      mockRepository.findOne.mockResolvedValue(mockCard);
      mockRepository.remove.mockResolvedValue(mockCard);

      await service.remove(mockUser.userId, 'card-id');

      expect(mockRepository.remove).toHaveBeenCalledWith(mockCard);
    });
  });

  describe('getInvoice', () => {
    it('should calculate invoice period and total correctly', async () => {
      mockRepository.findOne.mockResolvedValue(mockCard);

      const mockTransactions = [
        { id: 't1', amount: 100, date: new Date() },
        { id: 't2', amount: 50.5, date: new Date() },
      ];
      mockTransactionQueryBuilder.getMany.mockResolvedValue(mockTransactions);

      const result = await service.getInvoice(
        mockUser.userId,
        'card-id',
        5,
        2024,
      );

      // May 2024 Invoice (Closing Day 10)
      // Range: April 10 to May 10 (exclusive)

      expect(result.total).toBe(150.5);
      expect(result.card).toEqual(mockCard);
      expect(result.period.start).toEqual(new Date(2024, 3, 10)); // April 10
      expect(result.period.end).toEqual(new Date(2024, 4, 10)); // May 10
      expect(mockTransactionRepository.createQueryBuilder).toHaveBeenCalled();
      expect(mockTransactionQueryBuilder.where).toHaveBeenCalledWith(
        't.credit_card_id = :cardId',
        { cardId: 'card-id' },
      );
    });
  });
});
