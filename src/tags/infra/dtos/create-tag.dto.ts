import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsHexColor } from 'class-validator';

export class CreateTagDto {
  @ApiProperty({ example: 'Trip 2024', description: 'Tag name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ example: '#FF0000', description: 'Hex color code' })
  @IsString()
  @IsOptional()
  @IsHexColor()
  color?: string;
}
