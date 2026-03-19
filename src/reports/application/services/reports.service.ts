import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import {
  Transaction,
  TransactionStatus,
  TransactionType,
} from '../../../transactions/infra/entities/transaction.entity';
import { ExchangeRatesService } from '../../../exchange-rates/application/services/exchange-rates.service';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    private readonly exchangeRatesService: ExchangeRatesService,
  ) {}

  async getFinancialEvolution(
    userId: string,
    months: number = 6,
    targetCurrency: string = 'BRL',
  ) {
    const today = new Date();
    const results = [];

    for (let i = months - 1; i >= 0; i--) {
      const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const month = date.getMonth() + 1;
      const year = date.getFullYear();

      const cashFlow = await this.getCashFlow(
        userId,
        month,
        year,
        targetCurrency,
      );
      results.push(cashFlow);
    }

    return results;
  }

  async getPendingTransactions(
    userId: string,
    targetCurrency: string = 'BRL',
  ) {
    // Buscar transações PENDENTES futuras ou atrasadas
    // Assumimos que "PENDING" significa que ainda não foi pago/recebido
    const transactions = await this.transactionRepository.find({
      where: {
        account: { userId },
        status: TransactionStatus.PENDING,
      },
      relations: ['account', 'categoryRelation'],
      order: { date: 'ASC' },
    });

    let totalPayable = 0;
    let totalReceivable = 0;

    const mappedTransactions = await Promise.all(
      transactions.map(async (t) => {
        const transactionCurrency = t.account?.currency || 'BRL';
        let amount = Number(t.amount);

        if (transactionCurrency !== targetCurrency) {
          amount = await this.exchangeRatesService.convert(
            amount,
            transactionCurrency,
            targetCurrency,
          );
        }

        if (t.type === TransactionType.EXPENSE) {
          totalPayable += amount;
        } else {
          totalReceivable += amount;
        }

        return {
          ...t,
          convertedAmount: amount,
        };
      }),
    );

    return {
      summary: {
        totalPayable,
        totalReceivable,
        net: totalReceivable - totalPayable,
        currency: targetCurrency,
      },
      transactions: mappedTransactions,
    };
  }

  async getCashFlow(
    userId: string,
    month: number,
    year: number,
    targetCurrency: string = 'BRL',
  ) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59, 999);

    const transactions = await this.transactionRepository.find({
      where: {
        account: { userId },
        date: Between(startDate, endDate),
      },
      relations: ['account'],
    });

    let totalIncome = 0;
    let totalExpense = 0;

    for (const t of transactions) {
      const transactionCurrency = t.account?.currency || 'BRL';
      const amount = Number(t.amount);

      let convertedAmount = amount;
      if (transactionCurrency !== targetCurrency) {
        convertedAmount = await this.exchangeRatesService.convert(
          amount,
          transactionCurrency,
          targetCurrency,
        );
      }

      if (t.type === TransactionType.INCOME) {
        totalIncome += convertedAmount;
      } else {
        totalExpense += convertedAmount;
      }
    }

    return {
      period: { month, year },
      targetCurrency,
      income: totalIncome,
      expense: totalExpense,
      balance: totalIncome - totalExpense,
    };
  }

  async getExpensesByCategory(
    userId: string,
    month: number,
    year: number,
    targetCurrency: string = 'BRL',
  ) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59, 999);

    const transactions = await this.transactionRepository.find({
      where: {
        account: { userId },
        type: TransactionType.EXPENSE,
        date: Between(startDate, endDate),
      },
      relations: ['categoryRelation', 'account'],
    });

    const categoryMap = new Map<string, number>();

    for (const t of transactions) {
      const categoryName = t.categoryRelation?.name || 'Sem Categoria';
      const transactionCurrency = t.account?.currency || 'BRL';
      let amount = Number(t.amount);

      if (transactionCurrency !== targetCurrency) {
        amount = await this.exchangeRatesService.convert(
          amount,
          transactionCurrency,
          targetCurrency,
        );
      }

      const current = categoryMap.get(categoryName) || 0;
      categoryMap.set(categoryName, current + amount);
    }

    return Array.from(categoryMap.entries()).map(([category, amount]) => ({
      category,
      amount,
    }));
  }
}
