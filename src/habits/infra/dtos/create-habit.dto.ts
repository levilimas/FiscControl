import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsEnum } from 'class-validator';
import { HabitDifficulty, HabitFrequency } from '../entities/habit.entity';

export class CreateHabitDto {
  @ApiProperty({ example: 'Leitura Diária', description: 'Habit title' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional({
    example: 'Ler 10 páginas de um livro',
    description: 'Description',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ enum: HabitFrequency, example: HabitFrequency.DAILY })
  @IsEnum(HabitFrequency)
  frequency: HabitFrequency;

  @ApiProperty({ enum: HabitDifficulty, example: HabitDifficulty.MEDIUM })
  @IsEnum(HabitDifficulty)
  difficulty: HabitDifficulty;
}
