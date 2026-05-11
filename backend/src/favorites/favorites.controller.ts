import { Controller, Post, Get, Delete, Param, ParseIntPipe, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { FavoritesService } from './favorites.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('favorites')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('favorites')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Post(':itemId')
  add(@Param('itemId', ParseIntPipe) itemId: number, @Request() req) {
    return this.favoritesService.add(req.user.id, itemId);
  }

  @Get()
  findAll(@Request() req) {
    return this.favoritesService.findAll(req.user.id);
  }

  @Delete(':itemId')
  remove(@Param('itemId', ParseIntPipe) itemId: number, @Request() req) {
    return this.favoritesService.remove(req.user.id, itemId);
  }
}
