import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  Equals,
  IsBoolean,
  IsDateString,
  IsEmail,
  IsOptional,
  IsPhoneNumber,
  IsString,
  MinLength,
} from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'John Doe', description: 'User full name' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'user@example.com', description: 'User email' })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'strongpassword123',
    description: 'User password (min 6 chars)',
    minLength: 6,
  })
  @IsString()
  @MinLength(6)
  password: string;

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

  @ApiProperty({
    example: true,
    description: 'User accepted terms of service',
  })
  @IsBoolean()
  @Equals(true, { message: 'Terms must be accepted' })
  termsAccepted: boolean;

  @ApiProperty({
    example: true,
    description: 'User accepted privacy policy',
  })
  @IsBoolean()
  @Equals(true, { message: 'Privacy policy must be accepted' })
  privacyPolicyAccepted: boolean;
}
