import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { HabitsService } from '../services/habits.service';
import { CreateHabitDto } from '../../infra/dtos/create-habit.dto';
import { UpdateHabitDto } from '../../infra/dtos/update-habit.dto';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../auth/infra/guards/jwt-auth.guard';
import { CurrentUser } from '../../../auth/infra/decorators/current-user.decorator';

@ApiTags('Habits (Gamification)')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('habits')
export class HabitsController {
  constructor(private readonly habitsService: HabitsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new habit (Quest)' })
  create(
    @CurrentUser() user: { userId: string },
    @Body() createHabitDto: CreateHabitDto,
  ) {
    return this.habitsService.create(user.userId, createHabitDto);
  }

  @Get()
  @ApiOperation({ summary: 'List all habits' })
  findAll(@CurrentUser() user: { userId: string }) {
    return this.habitsService.findAll(user.userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a habit by ID' })
  findOne(@CurrentUser() user: { userId: string }, @Param('id') id: string) {
    return this.habitsService.findOne(user.userId, id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a habit' })
  update(
    @CurrentUser() user: { userId: string },
    @Param('id') id: string,
    @Body() updateHabitDto: UpdateHabitDto,
  ) {
    return this.habitsService.update(user.userId, id, updateHabitDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a habit' })
  remove(@CurrentUser() user: { userId: string }, @Param('id') id: string) {
    return this.habitsService.remove(user.userId, id);
  }

  @Post(':id/complete')
  @ApiOperation({ summary: 'Complete a habit for today (Earn XP!)' })
  complete(@CurrentUser() user: { userId: string }, @Param('id') id: string) {
    return this.habitsService.completeHabit(user.userId, id);
  }
}
