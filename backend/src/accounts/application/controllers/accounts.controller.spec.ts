import { Test, TestingModule } from '@nestjs/testing';
import { AccountsController } from './accounts.controller';
import { AccountsService } from '../services/accounts.service';
import { CreateAccountDto } from '../../infra/dtos/create-account.dto';
import { UpdateAccountDto } from '../../infra/dtos/update-account.dto';
import { AccountType } from '../../infra/entities/account.entity';

describe('AccountsController', () => {
  let controller: AccountsController;
  let accountsService: {
    create: jest.Mock;
    findAll: jest.Mock;
    findOne: jest.Mock;
    update: jest.Mock;
    remove: jest.Mock;
  };

  const mockUser = { userId: 'user-uuid' };
  const mockAccount = {
    id: 'account-uuid',
    userId: mockUser.userId,
    name: 'My Account',
    accountType: AccountType.CORRENTE,
    initialBalance: 0,
    currentBalance: 0,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AccountsController],
      providers: [
        {
          provide: AccountsService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AccountsController>(AccountsController);
    accountsService = module.get(AccountsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create an account', async () => {
      const dto: CreateAccountDto = {
        name: 'My Account',
        accountType: AccountType.CORRENTE,
      };

      accountsService.create.mockResolvedValue(mockAccount);

      const result = await controller.create(mockUser, dto);

      expect(accountsService.create).toHaveBeenCalledWith(mockUser.userId, dto);
      expect(result).toEqual(mockAccount);
    });
  });

  describe('findAll', () => {
    it('should return an array of accounts', async () => {
      accountsService.findAll.mockResolvedValue([mockAccount]);

      const result = await controller.findAll(mockUser);

      expect(accountsService.findAll).toHaveBeenCalledWith(mockUser.userId);
      expect(result).toEqual([mockAccount]);
    });
  });

  describe('findOne', () => {
    it('should return a single account', async () => {
      accountsService.findOne.mockResolvedValue(mockAccount);

      const result = await controller.findOne(mockUser, 'account-uuid');

      expect(accountsService.findOne).toHaveBeenCalledWith(
        mockUser.userId,
        'account-uuid',
      );
      expect(result).toEqual(mockAccount);
    });
  });

  describe('update', () => {
    it('should update an account', async () => {
      const dto: UpdateAccountDto = { name: 'Updated Name' };
      const updatedAccount = { ...mockAccount, ...dto };

      accountsService.update.mockResolvedValue(updatedAccount);

      const result = await controller.update(mockUser, 'account-uuid', dto);

      expect(accountsService.update).toHaveBeenCalledWith(
        mockUser.userId,
        'account-uuid',
        dto,
      );
      expect(result).toEqual(updatedAccount);
    });
  });

  describe('remove', () => {
    it('should remove an account', async () => {
      accountsService.remove.mockResolvedValue(undefined);

      await controller.remove(mockUser, 'account-uuid');

      expect(accountsService.remove).toHaveBeenCalledWith(
        mockUser.userId,
        'account-uuid',
      );
    });
  });
});
