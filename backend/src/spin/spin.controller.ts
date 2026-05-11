import { Controller, Post, Get, Param, ParseIntPipe, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { SpinService } from './spin.service';
import { AiService } from '../ai/ai.service';
import { ItemsService } from '../items/items.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('spin')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('spin')
export class SpinController {
  constructor(
    private readonly spinService: SpinService,
    private readonly aiService: AiService,
    private readonly itemsService: ItemsService,
  ) {}

  @Post(':categoryId')
  spin(@Param('categoryId', ParseIntPipe) categoryId: number, @Request() req) {
    return this.spinService.spin(categoryId, req.user.id);
  }

  @Post(':historyId/ai')
  async enrichWithAi(@Param('historyId', ParseIntPipe) historyId: number, @Request() req) {
    // Находим запись истории и получаем вариант + категорию
    const history = await this.spinService.getHistory(req.user.id);
    const record = history.find((h) => h.id === historyId);
    if (!record) return { text: '' };

    const text = await this.aiService.enrich(
      record.item.name,
      record.item.category.name,
    );
    await this.spinService.saveAiResponse(historyId, text);
    return { text };
  }

  @Get('history')
  getHistory(@Request() req) {
    return this.spinService.getHistory(req.user.id);
  }
}
