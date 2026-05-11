import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly repo: Repository<User>,
  ) {}

  create(data: Partial<User>): Promise<User> {
    return this.repo.save(this.repo.create(data));
  }

  findByEmail(email: string): Promise<User | null> {
    return this.repo.findOneBy({ email });
  }

  findById(id: number): Promise<User | null> {
    return this.repo.findOneBy({ id });
  }

  findByTelegramId(telegram_id: string): Promise<User | null> {
    return this.repo.findOneBy({ telegram_id });
  }

  async linkTelegram(userId: number, telegram_id: string): Promise<User> {
    await this.repo.update(userId, { telegram_id });
    return this.repo.findOneBy({ id: userId });
  }
}
