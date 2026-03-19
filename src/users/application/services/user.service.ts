import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../infra/entities/user.entity';

interface CreateUserInput {
  email: string;
  passwordHash: string;
  name: string;
  cpf?: string | null;
  phone?: string | null;
  birthDate?: Date | null;
  termsAcceptedAt?: Date | null;
  privacyPolicyAcceptedAt?: Date | null;
}

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async findById(id: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { id } });
  }

  async createUser(input: CreateUserInput): Promise<User> {
    const entity = this.usersRepository.create({
      email: input.email,
      passwordHash: input.passwordHash,
      name: input.name,
      cpf: input.cpf ?? null,
      phone: input.phone ?? null,
      birthDate: input.birthDate ?? null,
      termsAcceptedAt: input.termsAcceptedAt ?? null,
      privacyPolicyAcceptedAt: input.privacyPolicyAcceptedAt ?? null,
    });

    return this.usersRepository.save(entity);
  }

  async updateUser(user: User): Promise<User> {
    return this.usersRepository.save(user);
  }

  async remove(id: string): Promise<void> {
    await this.usersRepository.delete(id);
  }
}
