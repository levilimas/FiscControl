import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../auth/infra/guards/jwt-auth.guard';
import { CurrentUser } from '../../../auth/infra/decorators/current-user.decorator';
import { CreateTransactionDto } from '../../infra/dtos/create-transaction.dto';
import { UpdateTransactionDto } from '../../infra/dtos/update-transaction.dto';
import { TransactionsService } from '../services/transactions.service';

@ApiTags('Transactions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new transaction (Income/Expense)' })
  @ApiResponse({
    status: 201,
    description: 'Transaction created successfully.',
  })
  @ApiResponse({ status: 404, description: 'Account not found.' })
  async create(
    @CurrentUser() user: { userId: string },
    @Body() dto: CreateTransactionDto,
  ) {
    return this.transactionsService.create(user.userId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'List all transactions for the current user' })
  @ApiResponse({ status: 200, description: 'Return all transactions.' })
  async findAll(@CurrentUser() user: { userId: string }) {
    return this.transactionsService.findAll(user.userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific transaction' })
  @ApiResponse({ status: 200, description: 'Return the transaction.' })
  @ApiResponse({ status: 404, description: 'Transaction not found.' })
  async findOne(
    @CurrentUser() user: { userId: string },
    @Param('id') id: string,
  ) {
    return this.transactionsService.findOne(user.userId, id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a transaction' })
  @ApiResponse({
    status: 200,
    description: 'Transaction updated successfully (balance adjusted).',
  })
  @ApiResponse({ status: 404, description: 'Transaction not found.' })
  async update(
    @CurrentUser() user: { userId: string },
    @Param('id') id: string,
    @Body() dto: UpdateTransactionDto,
  ) {
    return this.transactionsService.update(user.userId, id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a transaction' })
  @ApiResponse({
    status: 200,
    description: 'Transaction deleted successfully (balance reverted).',
  })
  @ApiResponse({ status: 404, description: 'Transaction not found.' })
  async remove(
    @CurrentUser() user: { userId: string },
    @Param('id') id: string,
  ) {
    return this.transactionsService.remove(user.userId, id);
  }
}
