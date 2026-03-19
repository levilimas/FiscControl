import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'user@example.com', description: 'User email' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'strongpassword123', description: 'User password' })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({
    example: '123456',
    description: '2FA Token (if enabled)',
    required: false,
  })
  @IsString()
  @MinLength(6)
  @IsOptional()
  twoFactorToken?: string;
}
