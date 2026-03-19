import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class EnableTwoFactorDto {
  @ApiProperty({
    example: '123456',
    description: '2FA Token from Authenticator App',
  })
  @IsString()
  @Length(6, 6)
  token: string;
}
