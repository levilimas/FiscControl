import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreditCard } from '../../infra/entities/credit-card.entity';
import { CreateCreditCardDto } from '../../infra/dtos/create-credit-card.dto';
import { UpdateCreditCardDto } from '../../infra/dtos/update-credit-card.dto';
import { Transaction } from '../../../transactions/infra/entities/transaction.entity';

@Injectable()
export class CreditCardsService {
  constructor(
    @InjectRepository(CreditCard)
    private readonly creditCardRepository: Repository<CreditCard>,
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
  ) {}

  async create(userId: string, dto: CreateCreditCardDto): Promise<CreditCard> {
    const card = this.creditCardRepository.create({
      ...dto,
      userId,
    });
    return this.creditCardRepository.save(card);
  }

  async findAll(userId: string): Promise<CreditCard[]> {
    return this.creditCardRepository.find({
      where: { userId },
      order: { name: 'ASC' },
    });
  }

  async findOne(userId: string, id: string): Promise<CreditCard> {
    const card = await this.creditCardRepository.findOne({
      where: { id, userId },
    });
    if (!card) {
      throw new NotFoundException('Credit card not found');
    }
    return card;
  }

  async update(
    userId: string,
    id: string,
    dto: UpdateCreditCardDto,
  ): Promise<CreditCard> {
    const card = await this.findOne(userId, id);
    this.creditCardRepository.merge(card, dto);
    return this.creditCardRepository.save(card);
  }

  async remove(userId: string, id: string): Promise<void> {
    const card = await this.findOne(userId, id);
    await this.creditCardRepository.remove(card);
  }

  async getInvoice(
    userId: string,
    cardId: string,
    month: number,
    year: number,
  ) {
    const card = await this.findOne(userId, cardId);

    // Calcular período da fatura
    // Se fecha dia 10:
    // Fatura de Maio (5) vai de 10 de Abril a 09 de Maio.
    // Compras dia 10 de Abril entram em Maio.
    // Compras dia 09 de Maio entram em Maio.
    // Compras dia 10 de Maio entram em Junho.

    // Data de corte atual (Mês da fatura)
    const invoiceCloseDate = new Date(year, month - 1, card.closingDay);

    // Data de corte anterior (Início da fatura)
    const prevMonthCloseDate = new Date(year, month - 2, card.closingDay);

    // Buscar transações
    // O range deve ser: >= prevMonthCloseDate E < invoiceCloseDate
    // Wait, typeorm 'Between' is inclusive.
    // Let's use QueryBuilder for precise control or filter in memory (less efficient but safer for complex logic).
    // Let's try to query broadly and filter.
    // Actually, logic:
    // Transaction belongs to Invoice Month M if:
    // (Day < ClosingDay AND Month == M) OR (Day >= ClosingDay AND Month == M-1)

    // Simplest approach: Query all transactions for this card around the dates
    const transactions = await this.transactionRepository
      .createQueryBuilder('t')
      .leftJoinAndSelect('t.categoryRelation', 'category')
      .where('t.credit_card_id = :cardId', { cardId })
      .andWhere('t.date >= :startDate', { startDate: prevMonthCloseDate })
      .andWhere('t.date < :endDate', { endDate: invoiceCloseDate })
      .orderBy('t.date', 'DESC')
      .getMany();

    const total = transactions.reduce((sum, t) => sum + Number(t.amount), 0);

    return {
      card,
      period: {
        start: prevMonthCloseDate,
        end: invoiceCloseDate,
      },
      dueDate: new Date(year, month - 1, card.dueDay),
      total,
      transactions,
    };
  }
}
