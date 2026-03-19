import { ApiProperty } from '@nestjs/swagger';
import { IsJWT } from 'class-validator';

export class RefreshTokenDto {
  @ApiProperty({ description: 'Refresh Token' })
  @IsJWT()
  refreshToken: string;
}
