import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SpinService } from './spin.service';
import { SpinController } from './spin.controller';
import { SpinHistory } from './entities/spin-history.entity';
import { Item } from '../items/entities/item.entity';
import { ExcludedItem } from '../excluded/entities/excluded-item.entity';
import { AiModule } from '../ai/ai.module';
import { ItemsModule } from '../items/items.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([SpinHistory, Item, ExcludedItem]),
    AiModule,
    ItemsModule,
  ],
  controllers: [SpinController],
  providers: [SpinService],
  exports: [SpinService],
})
export class SpinModule {}
