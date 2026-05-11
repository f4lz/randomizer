import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExcludedItem } from './entities/excluded-item.entity';

@Injectable()
export class ExcludedService {
  constructor(
    @InjectRepository(ExcludedItem)
    private readonly repo: Repository<ExcludedItem>,
  ) {}

  async add(userId: number, itemId: number): Promise<ExcludedItem> {
    const exists = await this.repo.findOne({
      where: { user: { id: userId }, item: { id: itemId } },
    });
    if (exists) return exists;
    return this.repo.save(
      this.repo.create({ user: { id: userId }, item: { id: itemId } }),
    );
  }

  async remove(userId: number, itemId: number): Promise<void> {
    await this.repo.delete({ user: { id: userId }, item: { id: itemId } });
  }

  findAll(userId: number): Promise<ExcludedItem[]> {
    return this.repo.find({
      where: { user: { id: userId } },
      relations: ['item'],
    });
  }
}
