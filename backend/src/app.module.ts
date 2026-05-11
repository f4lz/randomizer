import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CategoriesModule } from './categories/categories.module';
import { ItemsModule } from './items/items.module';
import { SpinModule } from './spin/spin.module';
import { AiModule } from './ai/ai.module';
import { FavoritesModule } from './favorites/favorites.module';
import { ExcludedModule } from './excluded/excluded.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST || 'localhost',
      port: parseInt(process.env.DATABASE_PORT) || 5432,
      username: process.env.DATABASE_USER || 'postgres',
      password: process.env.DATABASE_PASSWORD || 'postgres',
      database: process.env.DATABASE_NAME || 'randomizer',
      autoLoadEntities: true,
      synchronize: true, // только для разработки
    }),
    AuthModule,
    UsersModule,
    CategoriesModule,
    ItemsModule,
    SpinModule,
    AiModule,
    FavoritesModule,
    ExcludedModule,
  ],
})
export class AppModule {}
