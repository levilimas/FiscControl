import { IsNotEmpty, IsNumber, IsString, Max, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCreditCardDto {
  @ApiProperty({ example: 'Nubank' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 5000.0 })
  @IsNumber()
  limit: number;

  @ApiProperty({
    example: 10,
    description: 'Day of the month when invoice closes',
  })
  @IsNumber()
  @Min(1)
  @Max(31)
  closingDay: number;

  @ApiProperty({
    example: 17,
    description: 'Day of the month when invoice is due',
  })
  @IsNumber()
  @Min(1)
  @Max(31)
  dueDay: number;
}
