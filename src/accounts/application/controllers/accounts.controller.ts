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
import { AccountsService } from '../services/accounts.service';
import { CreateAccountDto } from '../../infra/dtos/create-account.dto';
import { UpdateAccountDto } from '../../infra/dtos/update-account.dto';

@ApiTags('Accounts')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new account' })
  @ApiResponse({ status: 201, description: 'Account successfully created.' })
  async create(
    @CurrentUser() user: { userId: string },
    @Body() createAccountDto: CreateAccountDto,
  ) {
    return this.accountsService.create(user.userId, createAccountDto);
  }

  @Get()
  @ApiOperation({ summary: 'List all accounts for the current user' })
  @ApiResponse({ status: 200, description: 'Return all accounts.' })
  async findAll(@CurrentUser() user: { userId: string }) {
    return this.accountsService.findAll(user.userId);
  }

  @Get('dashboard')
  @ApiOperation({
    summary: 'Get dashboard data (accounts + consolidated balance)',
  })
  @ApiResponse({
    status: 200,
    description: 'Return accounts and total balance in BRL.',
  })
  async getDashboard(@CurrentUser() user: { userId: string }) {
    return this.accountsService.getDashboard(user.userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific account' })
  @ApiResponse({ status: 200, description: 'Return the account.' })
  @ApiResponse({ status: 404, description: 'Account not found.' })
  async findOne(
    @CurrentUser() user: { userId: string },
    @Param('id') id: string,
  ) {
    return this.accountsService.findOne(user.userId, id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an account' })
  @ApiResponse({ status: 200, description: 'Account successfully updated.' })
  @ApiResponse({ status: 404, description: 'Account not found.' })
  async update(
    @CurrentUser() user: { userId: string },
    @Param('id') id: string,
    @Body() updateAccountDto: UpdateAccountDto,
  ) {
    return this.accountsService.update(user.userId, id, updateAccountDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an account' })
  @ApiResponse({ status: 200, description: 'Account successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Account not found.' })
  async remove(
    @CurrentUser() user: { userId: string },
    @Param('id') id: string,
  ) {
    return this.accountsService.remove(user.userId, id);
  }
}
