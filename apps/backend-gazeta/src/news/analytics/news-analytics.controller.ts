import {
  Controller,
  Post,
  Param,
  ParseIntPipe,
  UseInterceptors
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam
} from '@nestjs/swagger';
import { NewsAnalyticsService } from './news-analytics.service';
import { NewsErrorInterceptor } from '../interceptors/news-error.interceptor';

@ApiTags('Notícias - Analytics')
@Controller('news')
@UseInterceptors(NewsErrorInterceptor)
export class NewsAnalyticsController {
  constructor(private readonly newsAnalyticsService: NewsAnalyticsService) {}

  @Post(':id/view')
  @ApiOperation({
    summary: 'Incrementar visualização',
    description: 'Endpoint para incrementar o contador de visualizações da notícia (apenas para notícias publicadas)'
  })
  @ApiParam({ name: 'id', description: 'ID da notícia', type: 'number' })
  @ApiResponse({
    status: 200,
    description: 'Visualização incrementada com sucesso',
    schema: {
      type: 'object',
      properties: {
        views: { type: 'number', example: 1251 }
      }
    }
  })
  @ApiResponse({ status: 404, description: 'Notícia não encontrada ou não publicada' })
  async incrementView(@Param('id', ParseIntPipe) id: number): Promise<{ views: number }> {
    const views = await this.newsAnalyticsService.incrementView(id);
    return { views };
  }
}

