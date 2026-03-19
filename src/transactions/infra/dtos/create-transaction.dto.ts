import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
} from 'class-validator';
import {
  TransactionStatus,
  TransactionType,
} from '../entities/transaction.entity';

export class CreateTransactionDto {
  @ApiPropertyOptional({
    example: 'd290f1ee-6c54-4b01-90e6-d701748f0851',
    description: 'Account ID to link the transaction',
  })
  @IsUUID()
  @IsOptional()
  accountId?: string;

  @ApiPropertyOptional({
    description: 'Credit Card ID',
  })
  @IsUUID()
  @IsOptional()
  creditCardId?: string;

  @ApiPropertyOptional({
    description: 'Total installments',
  })
  @IsNumber()
  @IsOptional()
  totalInstallments?: number;

  @ApiPropertyOptional({
    description: 'External ID for import deduplication',
  })
  @IsString()
  @IsOptional()
  externalId?: string;

  @ApiProperty({
    enum: TransactionType,
    example: TransactionType.EXPENSE,
    description: 'Type of the transaction (INCOME or EXPENSE)',
  })
  @IsEnum(TransactionType)
  type: TransactionType;

  @ApiProperty({
    example: 50.99,
    description: 'Amount of the transaction',
  })
  @IsNumber()
  @IsPositive()
  amount: number;

  @ApiProperty({
    example: 'Lunch at Restaurant',
    description: 'Description of the transaction',
  })
  @IsString()
  description: string;

  @ApiPropertyOptional({
    example: 'Food',
    description: 'Category name (deprecated, use categoryId)',
  })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({
    example: 'd290f1ee-6c54-4b01-90e6-d701748f0851',
    description: 'Category ID',
  })
  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @ApiProperty({
    example: '2023-10-27T10:00:00Z',
    description: 'Date of the transaction',
  })
  @IsDateString()
  date: string; // Recebemos como string ISO, o TypeORM converte

  @ApiPropertyOptional({
    enum: TransactionStatus,
    example: TransactionStatus.COMPLETED,
    description: 'Status of the transaction',
    default: TransactionStatus.COMPLETED,
  })
  @IsOptional()
  @IsEnum(TransactionStatus)
  status?: TransactionStatus;
}
