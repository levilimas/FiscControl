import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsUUID,
  Max,
  Min,
} from 'class-validator';

export class CreateGoalDto {
  @ApiProperty({
    example: 'd290f1ee-6c54-4b01-90e6-d701748f0851',
    description: 'Category ID to link the goal',
  })
  @IsUUID()
  @IsNotEmpty()
  categoryId: string;

  @ApiProperty({
    example: 500.0,
    description: 'Target amount for the goal',
  })
  @IsNumber()
  @IsPositive()
  amount: number;

  @ApiProperty({
    example: 10,
    description: 'Month of the goal (1-12)',
  })
  @IsInt()
  @Min(1)
  @Max(12)
  month: number;

  @ApiProperty({
    example: 2026,
    description: 'Year of the goal',
  })
  @IsInt()
  @Min(2000)
  @Max(2100)
  year: number;
}
