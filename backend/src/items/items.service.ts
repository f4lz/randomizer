import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Item } from './entities/item.entity';
import { CreateItemDto } from './dto/create-item.dto';

@Injectable()
export class ItemsService {
  constructor(
    @InjectRepository(Item)
    private readonly repo: Repository<Item>,
  ) {}

  findByCategory(categoryId: number): Promise<Item[]> {
    return this.repo.find({
      where: { category: { id: categoryId } },
      relations: ['category', 'owner'],
    });
  }

  async create(dto: CreateItemDto, userId: number): Promise<Item> {
    const item = this.repo.create({
      name: dto.name,
      description: dto.description,
      category: { id: dto.category_id },
      owner: { id: userId },
    });
    return this.repo.save(item);
  }

  async remove(id: number, userId: number): Promise<void> {
    const item = await this.repo.findOne({
      where: { id },
      relations: ['owner'],
    });
    if (!item) throw new NotFoundException('Вариант не найден');
    if (item.owner?.id !== userId) throw new NotFoundException('Вариант не найден');
    await this.repo.remove(item);
  }

  findOne(id: number): Promise<Item | null> {
    return this.repo.findOne({ where: { id }, relations: ['category'] });
  }
}
