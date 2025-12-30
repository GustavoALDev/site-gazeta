import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Req,
  Ip,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { Request } from 'express';
import { AnalyticsService } from './analytics.service';
import { MetricsQueryDto } from './dto/metrics-query.dto';
import { KpiResponseDto } from './dto/kpi-response.dto';
import { TimeSeriesResponseDto } from './dto/time-series-response.dto';
import { TopNewsResponseDto } from './dto/top-news-response.dto';
import { ActivityResponseDto } from './dto/activity-response.dto';
import { TrackViewDto } from './dto/track-view.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Analytics')
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Post('track-view')
  @ApiOperation({
    summary: 'Registrar visualização de página',
    description:
      'Endpoint público para registrar visualizações de páginas e notícias',
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Visualização registrada',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        views: { type: 'number', description: 'Número atualizado de visualizações (apenas para notícias)' }
      }
    }
  })
  async trackView(
    @Body() trackViewDto: TrackViewDto,
    @Req() req: Request,
    @Ip() ip: string
  ) {
    const userAgent = req.headers['user-agent'];
    const result = await this.analyticsService.trackView(trackViewDto, userAgent, ip);
    return { 
      message: 'View tracked successfully',
      ...result
    };
  }

  @Get('kpis')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Obter KPIs do período',
    description: 'Retorna métricas principais (acessos, visitantes, etc)',
  })
  @ApiResponse({ status: 200, type: KpiResponseDto })
  async getKpis(@Query() query: MetricsQueryDto) {
    const kpis = await this.analyticsService.getKpis(query);
    return { kpis };
  }

  @Get('access-series')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Obter série temporal de acessos',
    description: 'Retorna dados para gráfico de acessos ao longo do tempo',
  })
  @ApiResponse({ status: 200, type: TimeSeriesResponseDto })
  async getAccessSeries(@Query() query: MetricsQueryDto) {
    return this.analyticsService.getAccessSeries(query);
  }

  @Get('pages-series')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Obter série temporal de páginas vistas',
    description: 'Retorna dados para gráfico de páginas vistas ao longo do tempo',
  })
  @ApiResponse({ status: 200, type: TimeSeriesResponseDto })
  async getPagesSeries(@Query() query: MetricsQueryDto) {
    return this.analyticsService.getPagesSeries(query);
  }

  @Get('top-news')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Obter top notícias por visualizações',
    description: 'Retorna as notícias mais vistas no período',
  })
  @ApiResponse({ status: 200, type: TopNewsResponseDto })
  async getTopNews(@Query() query: MetricsQueryDto) {
    const topNews = await this.analyticsService.getTopNews(query);
    return { topNews };
  }

  @Get('activities')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Obter atividades recentes',
    description: 'Retorna logs de atividades dos usuários',
  })
  @ApiResponse({ status: 200, type: ActivityResponseDto })
  async getActivities(@Query() query: MetricsQueryDto) {
    const activities = await this.analyticsService.getRecentActivities(query);
    return { activities };
  }
}

