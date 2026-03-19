import { Test, TestingModule } from '@nestjs/testing';
import { CreditCardsController } from './credit-cards.controller';
import { CreditCardsService } from '../services/credit-cards.service';
import { CreateCreditCardDto } from '../../infra/dtos/create-credit-card.dto';

describe('CreditCardsController', () => {
  let controller: CreditCardsController;
  let service: {
    create: jest.Mock;
    findAll: jest.Mock;
    findOne: jest.Mock;
    update: jest.Mock;
    remove: jest.Mock;
    getInvoice: jest.Mock;
  };

  const mockUser = { userId: 'user-id' };
  const mockCard = {
    id: 'card-id',
    userId: mockUser.userId,
    name: 'Test Card',
    limit: 1000,
    closingDay: 10,
    dueDay: 17,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CreditCardsController],
      providers: [
        {
          provide: CreditCardsService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
            getInvoice: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<CreditCardsController>(CreditCardsController);
    service = module.get(CreditCardsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a card', async () => {
      const dto: CreateCreditCardDto = {
        name: 'Test Card',
        limit: 1000,
        closingDay: 10,
        dueDay: 17,
      };
      service.create.mockResolvedValue(mockCard);

      const result = await controller.create(mockUser, dto);

      expect(service.create).toHaveBeenCalledWith(mockUser.userId, dto);
      expect(result).toEqual(mockCard);
    });
  });

  describe('findAll', () => {
    it('should return all cards', async () => {
      service.findAll.mockResolvedValue([mockCard]);

      const result = await controller.findAll(mockUser);

      expect(service.findAll).toHaveBeenCalledWith(mockUser.userId);
      expect(result).toEqual([mockCard]);
    });
  });

  describe('findOne', () => {
    it('should return a card', async () => {
      service.findOne.mockResolvedValue(mockCard);

      const result = await controller.findOne(mockUser, 'card-id');

      expect(service.findOne).toHaveBeenCalledWith(mockUser.userId, 'card-id');
      expect(result).toEqual(mockCard);
    });
  });

  describe('getInvoice', () => {
    it('should return invoice', async () => {
      const mockInvoice = { total: 100, transactions: [] };
      service.getInvoice.mockResolvedValue(mockInvoice);

      const result = await controller.getInvoice(mockUser, 'card-id', 5, 2024);

      expect(service.getInvoice).toHaveBeenCalledWith(
        mockUser.userId,
        'card-id',
        5,
        2024,
      );
      expect(result).toEqual(mockInvoice);
    });
  });

  describe('update', () => {
    it('should update a card', async () => {
      service.update.mockResolvedValue({ ...mockCard, name: 'New Name' });

      const result = await controller.update(mockUser, 'card-id', {
        name: 'New Name',
      });

      expect(service.update).toHaveBeenCalledWith(mockUser.userId, 'card-id', {
        name: 'New Name',
      });
      expect(result.name).toBe('New Name');
    });
  });

  describe('remove', () => {
    it('should remove a card', async () => {
      service.remove.mockResolvedValue(undefined);

      await controller.remove(mockUser, 'card-id');

      expect(service.remove).toHaveBeenCalledWith(mockUser.userId, 'card-id');
    });
  });
});
