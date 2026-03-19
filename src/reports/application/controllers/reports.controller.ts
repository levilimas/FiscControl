import { Controller, Get, UseGuards, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../auth/infra/guards/jwt-auth.guard';
import { CurrentUser } from '../../../auth/infra/decorators/current-user.decorator';
import { ReportsService } from '../services/reports.service';

@ApiTags('Reports')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('cash-flow')
  @ApiQuery({ name: 'month', required: true, type: Number })
  @ApiQuery({ name: 'year', required: true, type: Number })
  @ApiQuery({
    name: 'currency',
    required: false,
    type: String,
    description: 'Target currency for conversion (e.g. BRL, USD)',
  })
  getCashFlow(
    @CurrentUser() user: { userId: string },
    @Query('month') month: number,
    @Query('year') year: number,
    @Query('currency') currency?: string,
  ) {
    return this.reportsService.getCashFlow(user.userId, month, year, currency);
  }

  @Get('expenses-by-category')
  @ApiQuery({ name: 'month', required: true, type: Number })
  @ApiQuery({ name: 'year', required: true, type: Number })
  @ApiQuery({
    name: 'currency',
    required: false,
    type: String,
    description: 'Target currency for conversion',
  })
  getExpensesByCategory(
    @CurrentUser() user: { userId: string },
    @Query('month') month: number,
    @Query('year') year: number,
    @Query('currency') currency?: string,
  ) {
    return this.reportsService.getExpensesByCategory(
      user.userId,
      month,
      year,
      currency,
    );
  }

  @Get('financial-evolution')
  @ApiQuery({
    name: 'months',
    required: false,
    type: Number,
    description: 'Number of months to look back (default: 6)',
  })
  @ApiQuery({
    name: 'currency',
    required: false,
    type: String,
  })
  getFinancialEvolution(
    @CurrentUser() user: { userId: string },
    @Query('months') months?: number,
    @Query('currency') currency?: string,
  ) {
    return this.reportsService.getFinancialEvolution(
      user.userId,
      months,
      currency,
    );
  }

  @Get('pending-transactions')
  @ApiQuery({
    name: 'currency',
    required: false,
    type: String,
  })
  getPendingTransactions(
    @CurrentUser() user: { userId: string },
    @Query('currency') currency?: string,
  ) {
    return this.reportsService.getPendingTransactions(user.userId, currency);
  }
}
