import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tag } from '../../infra/entities/tag.entity';
import { CreateTagDto } from '../../infra/dtos/create-tag.dto';
import { UpdateTagDto } from '../../infra/dtos/update-tag.dto';

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
  ) {}

  async create(userId: string, createTagDto: CreateTagDto): Promise<Tag> {
    const tag = this.tagRepository.create({
      ...createTagDto,
      user: { id: userId } as any,
    });
    return this.tagRepository.save(tag);
  }

  async findAll(userId: string): Promise<Tag[]> {
    return this.tagRepository.find({
      where: { user: { id: userId } },
      order: { name: 'ASC' },
    });
  }

  async findOne(userId: string, id: string): Promise<Tag> {
    const tag = await this.tagRepository.findOne({
      where: { id, user: { id: userId } },
    });

    if (!tag) {
      throw new NotFoundException(`Tag with ID ${id} not found`);
    }
    return tag;
  }

  async update(
    userId: string,
    id: string,
    updateTagDto: UpdateTagDto,
  ): Promise<Tag> {
    const tag = await this.findOne(userId, id);
    this.tagRepository.merge(tag, updateTagDto);
    return this.tagRepository.save(tag);
  }

  async remove(userId: string, id: string): Promise<void> {
    const tag = await this.findOne(userId, id);
    await this.tagRepository.remove(tag);
  }
}

