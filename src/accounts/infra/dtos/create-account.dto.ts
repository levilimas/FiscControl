import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { AccountType } from '../entities/account.entity';

export class CreateAccountDto {
  @ApiProperty({ example: 'My Bank Account', description: 'Account name' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ example: 'Bank X', description: 'Bank name' })
  @IsOptional()
  @IsString()
  bankName?: string;

  @ApiProperty({
    enum: AccountType,
    example: AccountType.CORRENTE,
    description: 'Type of the account',
  })
  @IsEnum(AccountType)
  accountType: AccountType;

  @ApiPropertyOptional({
    example: 1000.5,
    description: 'Initial balance',
    default: 0,
  })
  @IsOptional()
  @IsNumber()
  initialBalance?: number;

  @ApiPropertyOptional({ default: 'BRL' })
  @IsString()
  @IsOptional()
  currency?: string;
}
