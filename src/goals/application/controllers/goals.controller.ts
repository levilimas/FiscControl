import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../auth/infra/guards/jwt-auth.guard';
import { CurrentUser } from '../../../auth/infra/decorators/current-user.decorator';
import { GoalsService } from '../services/goals.service';
import { CreateGoalDto } from '../../infra/dtos/create-goal.dto';
import { UpdateGoalDto } from '../../infra/dtos/update-goal.dto';

@ApiTags('Goals')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('goals')
export class GoalsController {
  constructor(private readonly goalsService: GoalsService) {}

  @Post()
  create(
    @CurrentUser() user: { userId: string },
    @Body() createGoalDto: CreateGoalDto,
  ) {
    return this.goalsService.create(user.userId, createGoalDto);
  }

  @Get()
  @ApiQuery({ name: 'month', required: true, type: Number })
  @ApiQuery({ name: 'year', required: true, type: Number })
  findAll(
    @CurrentUser() user: { userId: string },
    @Query('month') month: number,
    @Query('year') year: number,
  ) {
    return this.goalsService.findAll(user.userId, month, year);
  }

  @Get(':id')
  findOne(@CurrentUser() user: { userId: string }, @Param('id') id: string) {
    return this.goalsService.findOne(user.userId, id);
  }

  @Patch(':id')
  update(
    @CurrentUser() user: { userId: string },
    @Param('id') id: string,
    @Body() updateGoalDto: UpdateGoalDto,
  ) {
    return this.goalsService.update(user.userId, id, updateGoalDto);
  }

  @Delete(':id')
  remove(@CurrentUser() user: { userId: string }, @Param('id') id: string) {
    return this.goalsService.remove(user.userId, id);
  }
}
