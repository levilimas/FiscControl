import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';

export class UpdateUserDto {
  @ApiPropertyOptional({ example: 'John Doe', description: 'User full name' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    example: '12345678900',
    description: 'User CPF (digits only)',
  })
  @IsOptional()
  @IsString()
  cpf?: string;

  @ApiPropertyOptional({
    example: '+5511999999999',
    description: 'User phone number',
  })
  @IsOptional()
  @IsPhoneNumber('BR')
  phone?: string;

  @ApiPropertyOptional({
    example: '1990-01-01',
    description: 'User birth date (YYYY-MM-DD)',
  })
  @IsOptional()
  @IsDateString()
  birthDate?: string;
}
