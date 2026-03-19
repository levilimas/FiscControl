import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../../infra/entities/category.entity';
import { CreateCategoryDto } from '../../infra/dtos/create-category.dto';
import { UpdateCategoryDto } from '../../infra/dtos/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async create(
    userId: string,
    createCategoryDto: CreateCategoryDto,
  ): Promise<Category> {
    const category = this.categoryRepository.create({
      ...createCategoryDto,
      userId,
    });
    return this.categoryRepository.save(category);
  }

  async findAll(userId: string): Promise<Category[]> {
    return this.categoryRepository.find({
      where: { userId },
      order: { name: 'ASC' },
    });
  }

  async findById(id: string, userId: string): Promise<Category> {
    const category = await this.categoryRepository.findOne({ where: { id } });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    if (category.userId !== userId) {
      throw new UnauthorizedException('Access denied');
    }

    return category;
  }

  async update(
    id: string,
    userId: string,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    const category = await this.findById(id, userId);

    this.categoryRepository.merge(category, updateCategoryDto);
    return this.categoryRepository.save(category);
  }

  async remove(id: string, userId: string): Promise<void> {
    const category = await this.findById(id, userId);
    await this.categoryRepository.remove(category);
  }
}
