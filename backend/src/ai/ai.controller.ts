import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { AiService } from './ai.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

class GenerateIdeaDto {
  @IsString()
  category_name: string;
}

@ApiTags('ai')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('generate')
  @ApiOperation({ summary: 'Генерация новой идеи с помощью ИИ' })
  async generate(@Body() dto: GenerateIdeaDto) {
    const idea = await this.aiService.generate(dto.category_name);
    return { idea };
  }
}
