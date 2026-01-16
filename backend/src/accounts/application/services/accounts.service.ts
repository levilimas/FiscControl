import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Account } from '../../infra/entities/account.entity';
import { CreateAccountDto } from '../../infra/dtos/create-account.dto';
import { UpdateAccountDto } from '../../infra/dtos/update-account.dto';

@Injectable()
export class AccountsService {
  constructor(
    @InjectRepository(Account)
    private readonly accountsRepository: Repository<Account>,
  ) {}

  async create(
    userId: string,
    createAccountDto: CreateAccountDto,
  ): Promise<Account> {
    const account = this.accountsRepository.create({
      ...createAccountDto,
      userId,
      currentBalance: createAccountDto.initialBalance ?? 0,
    });

    return this.accountsRepository.save(account);
  }

  async findAll(userId: string): Promise<Account[]> {
    return this.accountsRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(userId: string, id: string): Promise<Account> {
    const account = await this.accountsRepository.findOne({
      where: { id, userId },
    });

    if (!account) {
      throw new NotFoundException('Account not found');
    }

    return account;
  }

  async update(
    userId: string,
    id: string,
    updateAccountDto: UpdateAccountDto,
  ): Promise<Account> {
    const account = await this.findOne(userId, id);

    this.accountsRepository.merge(account, updateAccountDto);

    return this.accountsRepository.save(account);
  }

  async remove(userId: string, id: string): Promise<void> {
    const account = await this.findOne(userId, id);

    await this.accountsRepository.remove(account);
  }
}
