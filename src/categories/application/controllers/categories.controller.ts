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
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../auth/infra/guards/jwt-auth.guard';
import { CurrentUser } from '../../../auth/infra/decorators/current-user.decorator';
import { CategoriesService } from '../services/categories.service';
import { CreateCategoryDto } from '../../infra/dtos/create-category.dto';
import { UpdateCategoryDto } from '../../infra/dtos/update-category.dto';

@ApiTags('Categories')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  create(
    @CurrentUser() user: { userId: string },
    @Body() createCategoryDto: CreateCategoryDto,
  ) {
    return this.categoriesService.create(user.userId, createCategoryDto);
  }

  @Get()
  findAll(@CurrentUser() user: { userId: string }) {
    return this.categoriesService.findAll(user.userId);
  }

  @Get(':id')
  findOne(@CurrentUser() user: { userId: string }, @Param('id') id: string) {
    return this.categoriesService.findById(id, user.userId);
  }

  @Patch(':id')
  update(
    @CurrentUser() user: { userId: string },
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(id, user.userId, updateCategoryDto);
  }

  @Delete(':id')
  remove(@CurrentUser() user: { userId: string }, @Param('id') id: string) {
    return this.categoriesService.remove(id, user.userId);
  }
}
