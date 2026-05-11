import { Controller, Post, Delete, Get, Param, ParseIntPipe, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ExcludedService } from './excluded.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('excluded')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('excluded')
export class ExcludedController {
  constructor(private readonly excludedService: ExcludedService) {}

  @Post(':itemId')
  add(@Param('itemId', ParseIntPipe) itemId: number, @Request() req) {
    return this.excludedService.add(req.user.id, itemId);
  }

  @Delete(':itemId')
  remove(@Param('itemId', ParseIntPipe) itemId: number, @Request() req) {
    return this.excludedService.remove(req.user.id, itemId);
  }

  @Get()
  findAll(@Request() req) {
    return this.excludedService.findAll(req.user.id);
  }
}
