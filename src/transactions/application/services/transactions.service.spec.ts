import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsService } from './transactions.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
  Transaction,
  TransactionStatus,
  TransactionType,
} from '../../infra/entities/transaction.entity';
import { Account } from '../../../accounts/infra/entities/account.entity';
import { DataSource } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { CreateTransactionDto } from '../../infra/dtos/create-transaction.dto';
import { UpdateTransactionDto } from '../../infra/dtos/update-transaction.dto';

describe('TransactionsService', () => {
  let service: TransactionsService;

  const mockUser = { userId: 'user-id' };
  const mockAccount = {
    id: 'account-id',
    userId: mockUser.userId,
    currentBalance: 100,
  } as Account;

  const mockTransaction = {
    id: 'transaction-id',
    accountId: mockAccount.id,
    amount: 50,
    type: TransactionType.EXPENSE,
    status: TransactionStatus.COMPLETED,
    account: mockAccount,
  } as Transaction;

  const mockManager = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    merge: jest.fn(),
    remove: jest.fn(),
  };

  const mockDataSource = {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call
    transaction: jest.fn((cb) => cb(mockManager)),
  };

  const mockTransactionRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
  };

  const mockAccountRepository = {
    // Repository methods if needed directly, but service uses manager mostly
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionsService,
        {
          provide: getRepositoryToken(Transaction),
          useValue: mockTransactionRepository,
        },
        {
          provide: getRepositoryToken(Account),
          useValue: mockAccountRepository,
        },
        {
          provide: DataSource,
          useValue: mockDataSource,
        },
      ],
    }).compile();

    service = module.get<TransactionsService>(TransactionsService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a transaction and update account balance (EXPENSE)', async () => {
      const dto: CreateTransactionDto = {
        accountId: 'account-id',
        amount: 50,
        type: TransactionType.EXPENSE,
        description: 'Test expense',
        date: new Date().toISOString(),
        status: TransactionStatus.COMPLETED,
      };

      mockManager.findOne.mockResolvedValue({ ...mockAccount });
      mockManager.create.mockReturnValue({ ...dto });
      mockManager.save.mockImplementation((entity, data) =>
        Promise.resolve(data || entity),
      );

      await service.create(mockUser.userId, dto);

      expect(mockManager.findOne).toHaveBeenCalledWith(Account, {
        where: { id: dto.accountId, userId: mockUser.userId },
      });
      // Account balance should decrease by 50 (100 - 50 = 50)
      expect(mockManager.save).toHaveBeenCalledWith(
        Account,
        expect.objectContaining({
          currentBalance: 50,
        }),
      );
      expect(mockManager.save).toHaveBeenCalledWith(
        Transaction,
        expect.anything(),
      );
    });

    it('should create a transaction and update account balance (INCOME)', async () => {
      const dto: CreateTransactionDto = {
        accountId: 'account-id',
        amount: 50,
        type: TransactionType.INCOME,
        description: 'Test income',
        date: new Date().toISOString(),
        status: TransactionStatus.COMPLETED,
      };

      mockManager.findOne.mockResolvedValue({ ...mockAccount });
      mockManager.create.mockReturnValue({ ...dto });
      mockManager.save.mockImplementation((entity, data) =>
        Promise.resolve(data || entity),
      );

      await service.create(mockUser.userId, dto);

      // Account balance should increase by 50 (100 + 50 = 150)
      expect(mockManager.save).toHaveBeenCalledWith(
        Account,
        expect.objectContaining({
          currentBalance: 150,
        }),
      );
    });

    it('should throw NotFoundException if account not found', async () => {
      const dto: CreateTransactionDto = {
        accountId: 'account-id',
        amount: 50,
        type: TransactionType.EXPENSE,
        description: 'Test',
        date: new Date().toISOString(),
        status: TransactionStatus.COMPLETED,
      };

      mockManager.findOne.mockResolvedValue(null);

      await expect(service.create(mockUser.userId, dto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findAll', () => {
    it('should return an array of transactions', async () => {
      mockTransactionRepository.find.mockResolvedValue([mockTransaction]);

      const result = await service.findAll(mockUser.userId);

      expect(result).toEqual([mockTransaction]);
      expect(mockTransactionRepository.find).toHaveBeenCalledWith({
        where: { account: { userId: mockUser.userId } },
        relations: ['account', 'categoryRelation'],
        order: { date: 'DESC', createdAt: 'DESC' },
      });
    });
  });

  describe('findOne', () => {
    it('should return a transaction', async () => {
      mockTransactionRepository.findOne.mockResolvedValue(mockTransaction);

      const result = await service.findOne(mockUser.userId, 'transaction-id');

      expect(result).toEqual(mockTransaction);
    });

    it('should throw NotFoundException if transaction not found', async () => {
      mockTransactionRepository.findOne.mockResolvedValue(null);

      await expect(
        service.findOne(mockUser.userId, 'invalid-id'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update transaction and revert/apply balance changes', async () => {
      const dto: UpdateTransactionDto = {
        amount: 80, // Changed from 50 to 80
      };

      // Existing transaction: Expense 50. Account Balance 100.
      // We are mocking that the transaction was already applied, so current account balance reflects that.
      // But wait, the mockAccount has currentBalance 100.
      // If the transaction was 50 expense, the balance BEFORE it was 150.
      // The logic:
      // 1. Revert old transaction (Expense 50) -> Balance becomes 100 + 50 = 150.
      // 2. Apply new transaction (Expense 80) -> Balance becomes 150 - 80 = 70.

      mockManager.findOne.mockResolvedValue({
        ...mockTransaction,
        account: { ...mockAccount },
      });
      mockManager.merge.mockImplementation((entity, existing, updates) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return {
          ...existing,
          ...updates,
        };
      });
      mockManager.save.mockImplementation((entity, data) =>
        Promise.resolve(data || entity),
      );

      await service.update(mockUser.userId, 'transaction-id', dto);

      // Verify balance updates
      // First save (revert): 100 + 50 = 150
      // Note: The service logic saves oldAccount if account ID changed, OR if it's the same account it saves at the end.
      // In the code:
      // if (oldAccount.id !== newAccount.id) await manager.save(Account, oldAccount);
      // ...
      // if (updatedTransaction.status === TransactionStatus.COMPLETED) { ... await manager.save(Account, newAccount); }
      // else if (oldAccount.id === newAccount.id && existingTransaction.status === TransactionStatus.COMPLETED) { await manager.save(Account, newAccount); }

      // Since account didn't change:
      // Revert happens in memory: oldAccount.currentBalance += 50 -> 150.
      // Apply new happens in memory: newAccount.currentBalance -= 80 -> 70.
      // Final save: 70.

      expect(mockManager.save).toHaveBeenCalledWith(
        Account,
        expect.objectContaining({
          currentBalance: 70,
        }),
      );
    });

    it('should handle account change', async () => {
      const newAccount = {
        ...mockAccount,
        id: 'new-account-id',
        currentBalance: 200,
      };
      const dto: UpdateTransactionDto = {
        accountId: 'new-account-id',
      };

      // Old transaction: Expense 50 on Account 1 (Balance 100).
      // New transaction: Expense 50 on Account 2 (Balance 200).

      // Revert Old: Account 1 Balance -> 100 + 50 = 150.
      // Apply New: Account 2 Balance -> 200 - 50 = 150.

      mockManager.findOne.mockImplementation((entity, query) => {
        if (entity === Transaction)
          return Promise.resolve({
            ...mockTransaction,
            account: { ...mockAccount },
          });
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        if (entity === Account && query.where.id === 'new-account-id')
          return Promise.resolve({ ...newAccount });
        return Promise.resolve(null);
      });

      mockManager.merge.mockImplementation((entity, existing, updates) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return {
          ...existing,
          ...updates,
        };
      });
      mockManager.save.mockImplementation((entity, data) =>
        Promise.resolve(data || entity),
      );

      await service.update(mockUser.userId, 'transaction-id', dto);

      // Expect Account 1 to be saved with 150
      expect(mockManager.save).toHaveBeenCalledWith(
        Account,
        expect.objectContaining({
          id: 'account-id',
          currentBalance: 150,
        }),
      );

      // Expect Account 2 to be saved with 150
      expect(mockManager.save).toHaveBeenCalledWith(
        Account,
        expect.objectContaining({
          id: 'new-account-id',
          currentBalance: 150,
        }),
      );
    });
  });

  describe('remove', () => {
    it('should remove transaction and revert balance', async () => {
      // Transaction: Expense 50. Account Balance 100.
      // Revert: 100 + 50 = 150.

      mockManager.findOne.mockResolvedValue({
        ...mockTransaction,
        account: { ...mockAccount },
      });
      mockManager.save.mockImplementation((entity, data) =>
        Promise.resolve(data || entity),
      );
      mockManager.remove.mockResolvedValue(mockTransaction);

      await service.remove(mockUser.userId, 'transaction-id');

      expect(mockManager.save).toHaveBeenCalledWith(
        Account,
        expect.objectContaining({
          currentBalance: 150,
        }),
      );
      expect(mockManager.remove).toHaveBeenCalledWith(
        Transaction,
        expect.anything(),
      );
    });
  });
});
