import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExcludedService } from './excluded.service';
import { ExcludedController } from './excluded.controller';
import { ExcludedItem } from './entities/excluded-item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ExcludedItem])],
  controllers: [ExcludedController],
  providers: [ExcludedService],
  exports: [ExcludedService],
})
export class ExcludedModule {}
