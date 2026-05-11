import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';

const DEFAULT_CATEGORIES = [
  { name: 'Что приготовить', icon: '🍽️', description: 'Идеи для блюд и рецептов' },
  { name: 'Куда пойти',      icon: '📍', description: 'Места для прогулок и отдыха' },
  { name: 'Что посмотреть',  icon: '🎬', description: 'Фильмы, сериалы, шоу' },
  { name: 'Чем заняться',    icon: '🎯', description: 'Активности и хобби' },
  { name: 'Цели',            icon: '🚀', description: 'Цели для саморазвития' },
];

@Injectable()
export class CategoriesService implements OnModuleInit {
  constructor(
    @InjectRepository(Category)
    private readonly repo: Repository<Category>,
  ) {}

  async onModuleInit() {
    for (const cat of DEFAULT_CATEGORIES) {
      const exists = await this.repo.findOneBy({ name: cat.name });
      if (!exists) await this.repo.save(this.repo.create({ ...cat, is_system: true }));
    }
  }

  findAll(): Promise<Category[]> {
    return this.repo.find();
  }

  findOne(id: number): Promise<Category | null> {
    return this.repo.findOneBy({ id });
  }
}
