import { Test, TestingModule } from '@nestjs/testing';
import { ReportsService } from './reports.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
  Transaction,
  TransactionType,
} from '../../../transactions/infra/entities/transaction.entity';
import { ExchangeRatesService } from '../../../exchange-rates/application/services/exchange-rates.service';

describe('ReportsService', () => {
  let service: ReportsService;

  const mockUser = { userId: 'user-id' };
  
  const mockTransactionRepository = {
    find: jest.fn(),
  };

  const mockExchangeRatesService = {
    convert: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReportsService,
        {
          provide: getRepositoryToken(Transaction),
          useValue: mockTransactionRepository,
        },
        {
          provide: ExchangeRatesService,
          useValue: mockExchangeRatesService,
        },
      ],
    }).compile();

    service = module.get<ReportsService>(ReportsService);
    jest.clearAllMocks();
  });

  describe('getFinancialEvolution', () => {
    it('should return cash flow for the last N months', async () => {
      // Mock getCashFlow internal call?
      // Since getFinancialEvolution calls getCashFlow, and getCashFlow calls repository.find
      // We can just mock repository.find to return empty for simplicity or specific data
      mockTransactionRepository.find.mockResolvedValue([]);
      
      const result = await service.getFinancialEvolution(mockUser.userId, 2);
      
      expect(result).toHaveLength(2);
      expect(result[0]).toHaveProperty('balance');
      expect(result[1]).toHaveProperty('balance');
      expect(mockTransactionRepository.find).toHaveBeenCalledTimes(2);
    });
  });

  describe('getPendingTransactions', () => {
    it('should return pending transactions summary', async () => {
      const mockTransactions = [
        {
          amount: 100,
          type: TransactionType.EXPENSE,
          status: 'PENDING',
          account: { currency: 'BRL' },
        },
        {
          amount: 200,
          type: TransactionType.INCOME,
          status: 'PENDING',
          account: { currency: 'BRL' },
        },
      ];
      mockTransactionRepository.find.mockResolvedValue(mockTransactions);

      const result = await service.getPendingTransactions(mockUser.userId);

      expect(result.summary.totalPayable).toBe(100);
      expect(result.summary.totalReceivable).toBe(200);
      expect(result.summary.net).toBe(100);
      expect(result.transactions).toHaveLength(2);
    });
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getCashFlow', () => {
    it('should calculate cash flow with currency conversion', async () => {
      const mockTransactions = [
        {
          amount: 100,
          type: TransactionType.INCOME,
          account: { currency: 'BRL' },
        },
        {
          amount: 50,
          type: TransactionType.EXPENSE,
          account: { currency: 'USD' },
        },
      ];
      mockTransactionRepository.find.mockResolvedValue(mockTransactions);
      
      // Mock conversion: 50 USD -> 250 BRL
      mockExchangeRatesService.convert.mockResolvedValue(250);

      const result = await service.getCashFlow(mockUser.userId, 10, 2023);

      expect(result.income).toBe(100);
      expect(result.expense).toBe(250);
      expect(result.balance).toBe(-150);
      expect(mockExchangeRatesService.convert).toHaveBeenCalledWith(50, 'USD', 'BRL');
    });
  });

  describe('getExpensesByCategory', () => {
    it('should group expenses by category with conversion', async () => {
      const mockTransactions = [
        {
          amount: 100,
          categoryRelation: { name: 'Food' },
          account: { currency: 'BRL' },
        },
        {
          amount: 20,
          categoryRelation: { name: 'Food' },
          account: { currency: 'USD' },
        },
        {
          amount: 50,
          categoryRelation: { name: 'Transport' },
          account: { currency: 'BRL' },
        },
      ];
      mockTransactionRepository.find.mockResolvedValue(mockTransactions);
      
      // Mock conversion: 20 USD -> 100 BRL
      mockExchangeRatesService.convert.mockResolvedValue(100);

      const result = await service.getExpensesByCategory(mockUser.userId, 10, 2023);

      // Food: 100 + 100 (converted) = 200
      // Transport: 50
      
      const food = result.find(c => c.category === 'Food');
      const transport = result.find(c => c.category === 'Transport');

      expect(food).toBeDefined();
      expect(food?.amount).toBe(200);
      expect(transport).toBeDefined();
      expect(transport?.amount).toBe(50);
    });
  });
});
