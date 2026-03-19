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
import { TagsService } from '../services/tags.service';
import { CreateTagDto } from '../../infra/dtos/create-tag.dto';
import { UpdateTagDto } from '../../infra/dtos/update-tag.dto';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../auth/infra/guards/jwt-auth.guard';
import { CurrentUser } from '../../../auth/infra/decorators/current-user.decorator';

@ApiTags('Tags')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new tag' })
  create(
    @CurrentUser() user: { userId: string },
    @Body() createTagDto: CreateTagDto,
  ) {
    return this.tagsService.create(user.userId, createTagDto);
  }

  @Get()
  @ApiOperation({ summary: 'List all user tags' })
  findAll(@CurrentUser() user: { userId: string }) {
    return this.tagsService.findAll(user.userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a tag by ID' })
  findOne(@CurrentUser() user: { userId: string }, @Param('id') id: string) {
    return this.tagsService.findOne(user.userId, id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a tag' })
  update(
    @CurrentUser() user: { userId: string },
    @Param('id') id: string,
    @Body() updateTagDto: UpdateTagDto,
  ) {
    return this.tagsService.update(user.userId, id, updateTagDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a tag' })
  remove(@CurrentUser() user: { userId: string }, @Param('id') id: string) {
    return this.tagsService.remove(user.userId, id);
  }
}

