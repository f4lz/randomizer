import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not, In } from 'typeorm';
import { SpinHistory } from './entities/spin-history.entity';
import { Item } from '../items/entities/item.entity';
import { ExcludedItem } from '../excluded/entities/excluded-item.entity';

@Injectable()
export class SpinService {
  constructor(
    @InjectRepository(SpinHistory)
    private readonly historyRepo: Repository<SpinHistory>,
    @InjectRepository(Item)
    private readonly itemsRepo: Repository<Item>,
    @InjectRepository(ExcludedItem)
    private readonly excludedRepo: Repository<ExcludedItem>,
  ) {}

  async spin(categoryId: number, userId: number) {
    const excluded = await this.excludedRepo.find({
      where: { user: { id: userId } },
      relations: ['item'],
    });
    const excludedIds = excluded.map((e) => e.item.id);

    const where: any = { category: { id: categoryId } };
    if (excludedIds.length > 0) {
      where.id = Not(In(excludedIds));
    }

    const items = await this.itemsRepo.find({ where, relations: ['category'] });

    if (!items.length) {
      throw new NotFoundException('Нет доступных вариантов в этой категории');
    }

    const chosen = items[Math.floor(Math.random() * items.length)];
    const record = await this.historyRepo.save(
      this.historyRepo.create({ user: { id: userId }, item: chosen }),
    );

    return { history_id: record.id, item: chosen };
  }

  async saveAiResponse(historyId: number, text: string) {
    await this.historyRepo.update(historyId, { ai_response: text });
  }

  getHistory(userId: number): Promise<SpinHistory[]> {
    return this.historyRepo.find({
      where: { user: { id: userId } },
      relations: ['item', 'item.category'],
      order: { created_at: 'DESC' },
      take: 20,
    });
  }
}
