import { IsEnum, IsOptional, IsString } from 'class-validator';
import { CategoryType } from '../entities/category.entity';

export class UpdateCategoryDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsEnum(CategoryType)
  @IsOptional()
  type?: CategoryType;

  @IsString()
  @IsOptional()
  icon?: string;

  @IsString()
  @IsOptional()
  color?: string;
}
