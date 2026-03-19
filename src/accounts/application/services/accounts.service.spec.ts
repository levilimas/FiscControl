import { Test, TestingModule } from '@nestjs/testing';
import { AccountsService } from './accounts.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Account, AccountType } from '../../infra/entities/account.entity';
import { NotFoundException } from '@nestjs/common';
import { ExchangeRatesService } from '../../../exchange-rates/application/services/exchange-rates.service';

describe('AccountsService', () => {
  let service: AccountsService;

  const mockUser = { userId: 'user-id' };
  const mockAccount = {
    id: 'account-id',
    userId: mockUser.userId,
    name: 'Test Account',
    accountType: AccountType.CORRENTE,
    initialBalance: 0,
    currentBalance: 0,
    currency: 'BRL',
  } as Account;

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    merge: jest.fn(),
    remove: jest.fn(),
  };

  const mockExchangeRatesService = {
    convert: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AccountsService,
        {
          provide: getRepositoryToken(Account),
          useValue: mockRepository,
        },
        {
          provide: ExchangeRatesService,
          useValue: mockExchangeRatesService,
        },
      ],
    }).compile();

    service = module.get<AccountsService>(AccountsService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create an account', async () => {
      mockRepository.create.mockReturnValue(mockAccount);
      mockRepository.save.mockResolvedValue(mockAccount);

      const result = await service.create(mockUser.userId, {
        name: 'Test Account',
        accountType: AccountType.CORRENTE,
      });

      expect(result).toEqual(mockAccount);
      expect(mockRepository.create).toHaveBeenCalled();
      expect(mockRepository.save).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return array of accounts', async () => {
      mockRepository.find.mockResolvedValue([mockAccount]);

      const result = await service.findAll(mockUser.userId);

      expect(result).toEqual([mockAccount]);
      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { userId: mockUser.userId },
        order: { createdAt: 'DESC' },
      });
    });
  });

  describe('getDashboard', () => {
    it('should return accounts and total balance in BRL', async () => {
      const brlAccount = {
        ...mockAccount,
        currency: 'BRL',
        currentBalance: 100,
      };
      const usdAccount = {
        ...mockAccount,
        id: 'usd-id',
        currency: 'USD',
        currentBalance: 50,
      };

      mockRepository.find.mockResolvedValue([brlAccount, usdAccount]);
      mockExchangeRatesService.convert.mockResolvedValue(250); // 50 USD * 5 = 250 BRL

      const result = await service.getDashboard(mockUser.userId);

      expect(result).toEqual({
        accounts: [brlAccount, usdAccount],
        totalBalance: 350, // 100 + 250
        currency: 'BRL',
      });
      expect(mockExchangeRatesService.convert).toHaveBeenCalledWith(
        50,
        'USD',
        'BRL',
      );
    });
  });

  describe('findOne', () => {
    it('should return an account', async () => {
      mockRepository.findOne.mockResolvedValue(mockAccount);

      const result = await service.findOne(mockUser.userId, 'account-id');

      expect(result).toEqual(mockAccount);
    });

    it('should throw NotFoundException', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(
        service.findOne(mockUser.userId, 'invalid-id'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update an account', async () => {
      mockRepository.findOne.mockResolvedValue(mockAccount);
      mockRepository.save.mockResolvedValue({
        ...mockAccount,
        name: 'Updated',
      });

      const result = await service.update(mockUser.userId, 'account-id', {
        name: 'Updated',
      });

      expect(result.name).toBe('Updated');
      expect(mockRepository.merge).toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should remove an account', async () => {
      mockRepository.findOne.mockResolvedValue(mockAccount);
      mockRepository.remove.mockResolvedValue(mockAccount);

      await service.remove(mockUser.userId, 'account-id');

      expect(mockRepository.remove).toHaveBeenCalledWith(mockAccount);
    });
  });
});
