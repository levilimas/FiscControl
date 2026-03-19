import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsPositive } from 'class-validator';

export class UpdateGoalDto {
  @ApiPropertyOptional({
    example: 600.0,
    description: 'Target amount for the goal',
  })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  amount?: number;
}
