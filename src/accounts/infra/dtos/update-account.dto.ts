import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';
import { AccountType } from '../entities/account.entity';

export class UpdateAccountDto {
  @ApiPropertyOptional({
    example: 'My Updated Account',
    description: 'Account name',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ example: 'Bank Y', description: 'Bank name' })
  @IsOptional()
  @IsString()
  bankName?: string;

  @ApiPropertyOptional({
    enum: AccountType,
    example: AccountType.POUPANCA,
    description: 'Type of the account',
  })
  @IsOptional()
  @IsEnum(AccountType)
  accountType?: AccountType;

  @ApiPropertyOptional({ example: true, description: 'Is account active?' })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
