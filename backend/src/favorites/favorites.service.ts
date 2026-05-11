import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Favorite } from './entities/favorite.entity';

@Injectable()
export class FavoritesService {
  constructor(
    @InjectRepository(Favorite)
    private readonly repo: Repository<Favorite>,
  ) {}

  async add(userId: number, itemId: number): Promise<Favorite> {
    const exists = await this.repo.findOne({
      where: { user: { id: userId }, item: { id: itemId } },
    });
    if (exists) throw new ConflictException('Уже в избранном');
    return this.repo.save(
      this.repo.create({ user: { id: userId }, item: { id: itemId } }),
    );
  }

  findAll(userId: number): Promise<Favorite[]> {
    return this.repo.find({
      where: { user: { id: userId } },
      relations: ['item', 'item.category'],
      order: { created_at: 'DESC' },
    });
  }

  async remove(userId: number, itemId: number): Promise<void> {
    await this.repo.delete({ user: { id: userId }, item: { id: itemId } });
  }
}
