import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Account } from '../../../accounts/infra/entities/account.entity';
import { CreateTransactionDto } from '../../infra/dtos/create-transaction.dto';
import { UpdateTransactionDto } from '../../infra/dtos/update-transaction.dto';
import {
  Transaction,
  TransactionStatus,
  TransactionType,
} from '../../infra/entities/transaction.entity';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
    private readonly dataSource: DataSource,
  ) {}

  async create(
    userId: string,
    dto: CreateTransactionDto,
  ): Promise<Transaction> {
    return this.dataSource.transaction(async (manager) => {
      // 1. Validar e buscar a conta
      const account = await manager.findOne(Account, {
        where: { id: dto.accountId, userId },
      });

      if (!account) {
        throw new NotFoundException(
          'Account not found or does not belong to user',
        );
      }

      // 2. Criar a transação
      const transaction = manager.create(Transaction, {
        ...dto,
        status: dto.status ?? TransactionStatus.COMPLETED,
      });

      // 3. Atualizar saldo se a transação for efetivada (COMPLETED)
      if (transaction.status === TransactionStatus.COMPLETED) {
        const amount = Number(transaction.amount);
        if (transaction.type === TransactionType.INCOME) {
          account.currentBalance = Number(account.currentBalance) + amount;
        } else {
          account.currentBalance = Number(account.currentBalance) - amount;
        }
        await manager.save(Account, account);
      }

      // 4. Salvar transação
      return manager.save(Transaction, transaction);
    });
  }

  async findAll(userId: string): Promise<Transaction[]> {
    return this.transactionRepository.find({
      where: { account: { userId } },
      relations: ['account'],
      order: { date: 'DESC', createdAt: 'DESC' },
    });
  }

  async findOne(userId: string, id: string): Promise<Transaction> {
    const transaction = await this.transactionRepository.findOne({
      where: { id, account: { userId } },
      relations: ['account'],
    });

    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }

    return transaction;
  }

  async update(
    userId: string,
    id: string,
    dto: UpdateTransactionDto,
  ): Promise<Transaction> {
    return this.dataSource.transaction(async (manager) => {
      // 1. Buscar transação antiga com a conta
      const existingTransaction = await manager.findOne(Transaction, {
        where: { id, account: { userId } },
        relations: ['account'],
      });

      if (!existingTransaction) {
        throw new NotFoundException('Transaction not found');
      }

      const oldAccount = existingTransaction.account;

      // Se estiver mudando de conta, precisamos validar a nova conta
      let newAccount = oldAccount;
      if (dto.accountId && dto.accountId !== oldAccount.id) {
        const foundAccount = await manager.findOne(Account, {
          where: { id: dto.accountId, userId },
        });
        if (!foundAccount) throw new NotFoundException('New account not found');
        newAccount = foundAccount;
      }

      // 2. Reverter saldo da transação antiga (se estava COMPLETED)
      if (existingTransaction.status === TransactionStatus.COMPLETED) {
        const oldAmount = Number(existingTransaction.amount);
        if (existingTransaction.type === TransactionType.INCOME) {
          oldAccount.currentBalance =
            Number(oldAccount.currentBalance) - oldAmount;
        } else {
          oldAccount.currentBalance =
            Number(oldAccount.currentBalance) + oldAmount;
        }
        // Se a conta não mudou, newAccount já está atualizado na memória se for a mesma ref?
        // Cuidado com referências. Se for a mesma conta, oldAccount === newAccount.
        // Se mudou a conta, salvamos a oldAccount agora.
        if (oldAccount.id !== newAccount.id) {
          await manager.save(Account, oldAccount);
        }
      }

      // 3. Merge dos dados novos
      const updatedTransaction = manager.merge(
        Transaction,
        existingTransaction,
        dto,
      );

      // Se mudou a conta, associa a nova entidade conta (para salvar no DB a FK)
      if (dto.accountId) {
        updatedTransaction.account = newAccount;
        updatedTransaction.accountId = newAccount.id;
      }

      // 4. Aplicar novo saldo na conta (nova ou mesma) se COMPLETED
      if (updatedTransaction.status === TransactionStatus.COMPLETED) {
        // Nota: se a conta for a mesma, newAccount já tem o saldo revertido do passo 2?
        // Sim, se oldAccount === newAccount (mesma referência de objeto), o JS mantém.
        // Se não for a mesma referência, temos que garantir.
        // O findOne lá em cima retornou existingTransaction.account.

        const amount = Number(updatedTransaction.amount);
        if (updatedTransaction.type === TransactionType.INCOME) {
          newAccount.currentBalance =
            Number(newAccount.currentBalance) + amount;
        } else {
          newAccount.currentBalance =
            Number(newAccount.currentBalance) - amount;
        }
        await manager.save(Account, newAccount);
      } else if (
        oldAccount.id === newAccount.id &&
        existingTransaction.status === TransactionStatus.COMPLETED
      ) {
        // Se mudou de COMPLETED para PENDING na MESMA conta, já revertemos lá em cima e salvamos aqui.
        await manager.save(Account, newAccount);
      }

      return manager.save(Transaction, updatedTransaction);
    });
  }

  async remove(userId: string, id: string): Promise<void> {
    await this.dataSource.transaction(async (manager) => {
      const transaction = await manager.findOne(Transaction, {
        where: { id, account: { userId } },
        relations: ['account'],
      });

      if (!transaction) {
        throw new NotFoundException('Transaction not found');
      }

      // Reverter saldo se COMPLETED
      if (transaction.status === TransactionStatus.COMPLETED) {
        const account = transaction.account;
        const amount = Number(transaction.amount);

        if (transaction.type === TransactionType.INCOME) {
          account.currentBalance = Number(account.currentBalance) - amount;
        } else {
          account.currentBalance = Number(account.currentBalance) + amount;
        }
        await manager.save(Account, account);
      }

      await manager.remove(Transaction, transaction);
    });
  }
}
