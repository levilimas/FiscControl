import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './application/services/user.service';
import { UsersController } from './application/controllers/users.controller';
import { User } from './infra/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [UserService],
  exports: [UserService, TypeOrmModule],
})
export class UsersModule {}
