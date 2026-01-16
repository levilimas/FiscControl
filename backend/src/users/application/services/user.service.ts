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

  async createUser(input: CreateUserInput): Promise<User> {
    const entity = this.usersRepository.create({
      email: input.email,
      passwordHash: input.passwordHash,
      name: input.name,
      cpf: input.cpf ?? null,
      phone: input.phone ?? null,
    });

    return this.usersRepository.save(entity);
  }
}
