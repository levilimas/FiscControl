import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../auth/infra/guards/jwt-auth.guard';
import { CurrentUser } from '../../../auth/infra/decorators/current-user.decorator';
import { CreditCardsService } from '../services/credit-cards.service';
import { CreateCreditCardDto } from '../../infra/dtos/create-credit-card.dto';
import { UpdateCreditCardDto } from '../../infra/dtos/update-credit-card.dto';

@ApiTags('Credit Cards')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('credit-cards')
export class CreditCardsController {
  constructor(private readonly creditCardsService: CreditCardsService) {}

  @Post()
  create(
    @CurrentUser() user: { userId: string },
    @Body() createCreditCardDto: CreateCreditCardDto,
  ) {
    return this.creditCardsService.create(user.userId, createCreditCardDto);
  }

  @Get()
  findAll(@CurrentUser() user: { userId: string }) {
    return this.creditCardsService.findAll(user.userId);
  }

  @Get(':id')
  findOne(@CurrentUser() user: { userId: string }, @Param('id') id: string) {
    return this.creditCardsService.findOne(user.userId, id);
  }

  @Get(':id/invoice')
  @ApiQuery({ name: 'month', required: true, type: Number })
  @ApiQuery({ name: 'year', required: true, type: Number })
  getInvoice(
    @CurrentUser() user: { userId: string },
    @Param('id') id: string,
    @Query('month') month: number,
    @Query('year') year: number,
  ) {
    return this.creditCardsService.getInvoice(user.userId, id, month, year);
  }

  @Patch(':id')
  update(
    @CurrentUser() user: { userId: string },
    @Param('id') id: string,
    @Body() updateCreditCardDto: UpdateCreditCardDto,
  ) {
    return this.creditCardsService.update(user.userId, id, updateCreditCardDto);
  }

  @Delete(':id')
  remove(@CurrentUser() user: { userId: string }, @Param('id') id: string) {
    return this.creditCardsService.remove(user.userId, id);
  }
}
