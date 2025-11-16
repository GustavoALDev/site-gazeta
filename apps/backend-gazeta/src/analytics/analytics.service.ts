import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MetricsQueryDto } from './dto/metrics-query.dto';
import { KpiMetricDto } from './dto/kpi-response.dto';
import { TimeSeriesResponseDto } from './dto/time-series-response.dto';
import { TopNewsItemDto } from './dto/top-news-response.dto';
import { ActivityItemDto } from './dto/activity-response.dto';
import { TrackViewDto } from './dto/track-view.dto';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  /**
   * Registra uma visualização de página
   */
  async trackView(
    data: TrackViewDto,
    userAgent?: string,
    ipAddress?: string
  ): Promise<void> {
    // Detectar device type, browser, OS a partir do user agent
    const deviceInfo = this.parseUserAgent(userAgent);

    await this.prisma.pageView.create({
      data: {
        newsId: data.newsId,
        path: data.path,
        referer: data.referer,
        sessionId: data.sessionId,
        duration: data.duration,
        userAgent,
        ipAddress,
        deviceType: deviceInfo.deviceType,
        browser: deviceInfo.browser,
        os: deviceInfo.os,
      },
    });

    // Se for visualização de notícia, incrementar contador
    if (data.newsId) {
      await this.prisma.news.update({
        where: { id: data.newsId },
        data: { views: { increment: 1 } },
      });
    }
  }

  /**
   * Retorna KPIs do período
   */
  async getKpis(query: MetricsQueryDto): Promise<KpiMetricDto[]> {
    const { startDate, endDate } = query;
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Calcular período anterior para comparação
    const periodDuration = end.getTime() - start.getTime();
    const previousStart = new Date(start.getTime() - periodDuration);
    const previousEnd = new Date(start);

    // Total de acessos (current period)
    const totalAccesses = await this.prisma.pageView.count({
      where: {
        createdAt: { gte: start, lte: end },
      },
    });

    const previousAccesses = await this.prisma.pageView.count({
      where: {
        createdAt: { gte: previousStart, lt: previousEnd },
      },
    });

    // Páginas vistas (mesmo que acessos neste caso)
    const pagesViewed = totalAccesses;
    const previousPages = previousAccesses;

    // Visitantes únicos (sessões únicas)
    const uniqueVisitors = await this.prisma.pageView.findMany({
      where: {
        createdAt: { gte: start, lte: end },
        sessionId: { not: null },
      },
      select: { sessionId: true },
      distinct: ['sessionId'],
    });

    const previousUniqueVisitors = await this.prisma.pageView.findMany({
      where: {
        createdAt: { gte: previousStart, lt: previousEnd },
        sessionId: { not: null },
      },
      select: { sessionId: true },
      distinct: ['sessionId'],
    });

    // Tempo médio na página
    const avgDuration = await this.prisma.pageView.aggregate({
      where: {
        createdAt: { gte: start, lte: end },
        duration: { not: null },
      },
      _avg: { duration: true },
    });

    const previousAvgDuration = await this.prisma.pageView.aggregate({
      where: {
        createdAt: { gte: previousStart, lt: previousEnd },
        duration: { not: null },
      },
      _avg: { duration: true },
    });

    // Taxa de rejeição (páginas com duração < 10 segundos ou 1 visualização por sessão)
    const bounces = await this.prisma.pageView.count({
      where: {
        createdAt: { gte: start, lte: end },
        OR: [{ duration: { lt: 10 } }, { duration: null }],
      },
    });

    const previousBounces = await this.prisma.pageView.count({
      where: {
        createdAt: { gte: previousStart, lt: previousEnd },
        OR: [{ duration: { lt: 10 } }, { duration: null }],
      },
    });

    const bounceRate = totalAccesses > 0 ? (bounces / totalAccesses) * 100 : 0;
    const previousBounceRate =
      previousAccesses > 0 ? (previousBounces / previousAccesses) * 100 : 0;

    // Calcular deltas
    const calculateDelta = (current: number, previous: number): number => {
      if (previous === 0) return 0;
      return Math.round(((current - previous) / previous) * 100);
    };

    return [
      {
        label: 'Acessos',
        value: totalAccesses,
        deltaPercent: calculateDelta(totalAccesses, previousAccesses),
      },
      {
        label: 'Páginas Vistas',
        value: pagesViewed,
        deltaPercent: calculateDelta(pagesViewed, previousPages),
      },
      {
        label: 'Visitantes Únicos',
        value: uniqueVisitors.length,
        deltaPercent: calculateDelta(
          uniqueVisitors.length,
          previousUniqueVisitors.length
        ),
      },
      {
        label: 'Tempo Médio (min)',
        value: Math.round((avgDuration._avg.duration || 0) / 60),
        deltaPercent: calculateDelta(
          avgDuration._avg.duration || 0,
          previousAvgDuration._avg.duration || 0
        ),
      },
      {
        label: 'Taxa de Rejeição (%)',
        value: Math.round(bounceRate),
        deltaPercent: calculateDelta(bounceRate, previousBounceRate),
      },
    ];
  }

  /**
   * Retorna série temporal de acessos
   */
  async getAccessSeries(
    query: MetricsQueryDto
  ): Promise<TimeSeriesResponseDto> {
    const { startDate, endDate, granularity = 'day' } = query;
    const start = new Date(startDate);
    const end = new Date(endDate);

    const format =
      granularity === 'day' ? '%Y-%m-%d' : '%Y-%m-%d %H:00:00';

    const results = await this.prisma.$queryRaw<
      Array<{ period: string; count: bigint }>
    >`
      SELECT 
        DATE_FORMAT(created_at, ${format}) as period,
        COUNT(*) as count
      FROM page_views
      WHERE created_at >= ${start} AND created_at <= ${end}
      GROUP BY period
      ORDER BY period ASC
    `;

    const labels: string[] = [];
    const values: number[] = [];

    for (const row of results) {
      if (granularity === 'day') {
        const date = new Date(row.period);
        labels.push(
          date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
        );
      } else {
        const date = new Date(row.period);
        labels.push(date.toLocaleTimeString('pt-BR', { hour: '2-digit' }));
      }
      values.push(Number(row.count));
    }

    return { labels, values };
  }

  /**
   * Retorna série temporal de páginas vistas
   */
  async getPagesSeries(
    query: MetricsQueryDto
  ): Promise<TimeSeriesResponseDto> {
    // Similar ao getAccessSeries
    return this.getAccessSeries(query);
  }

  /**
   * Retorna top notícias por views
   */
  async getTopNews(
    query: MetricsQueryDto,
    limit = 10
  ): Promise<TopNewsItemDto[]> {
    const { startDate, endDate } = query;
    const start = new Date(startDate);
    const end = new Date(endDate);

    const topNews = await this.prisma.news.findMany({
      where: {
        pageViews: {
          some: {
            createdAt: { gte: start, lte: end },
          },
        },
      },
      select: {
        id: true,
        title: true,
        slug: true,
        views: true,
        pageViews: {
          where: {
            createdAt: { gte: start, lte: end },
          },
          orderBy: { createdAt: 'desc' },
          take: 1,
          select: { createdAt: true },
        },
      },
      orderBy: { views: 'desc' },
      take: limit,
    });

    return topNews.map((news) => ({
      title: news.title,
      slug: news.slug,
      views: news.views,
      lastAccess: news.pageViews[0]?.createdAt || new Date(),
    }));
  }

  /**
   * Retorna atividades recentes dos usuários
   */
  async getRecentActivities(
    query: MetricsQueryDto,
    limit = 12
  ): Promise<ActivityItemDto[]> {
    const { startDate, endDate } = query;
    const start = new Date(startDate);
    const end = new Date(endDate);

    const activities = await this.prisma.userActivity.findMany({
      where: {
        createdAt: { gte: start, lte: end },
      },
      include: {
        user: {
          select: { name: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    return activities.map((activity) => ({
      timestamp: activity.createdAt,
      user: activity.user.name,
      action: this.formatAction(activity.action),
      detail: activity.description || '',
    }));
  }

  /**
   * Registra atividade do usuário
   */
  async logActivity(
    userId: number,
    action: string,
    entityType?: string,
    entityId?: number,
    description?: string,
    ipAddress?: string,
    userAgent?: string
  ): Promise<void> {
    await this.prisma.userActivity.create({
      data: {
        userId,
        action,
        entityType,
        entityId,
        description,
        ipAddress,
        userAgent,
      },
    });
  }

  /**
   * Parser simples de User-Agent
   */
  private parseUserAgent(userAgent?: string): {
    deviceType: string;
    browser: string;
    os: string;
  } {
    if (!userAgent) {
      return { deviceType: 'unknown', browser: 'unknown', os: 'unknown' };
    }

    const ua = userAgent.toLowerCase();

    // Device type
    let deviceType = 'desktop';
    if (ua.includes('mobile') || ua.includes('android')) deviceType = 'mobile';
    else if (ua.includes('tablet') || ua.includes('ipad')) deviceType = 'tablet';

    // Browser
    let browser = 'unknown';
    if (ua.includes('chrome')) browser = 'Chrome';
    else if (ua.includes('firefox')) browser = 'Firefox';
    else if (ua.includes('safari') && !ua.includes('chrome')) browser = 'Safari';
    else if (ua.includes('edge')) browser = 'Edge';
    else if (ua.includes('msie') || ua.includes('trident')) browser = 'IE';

    // OS
    let os = 'unknown';
    if (ua.includes('windows')) os = 'Windows';
    else if (ua.includes('mac')) os = 'MacOS';
    else if (ua.includes('linux')) os = 'Linux';
    else if (ua.includes('android')) os = 'Android';
    else if (ua.includes('ios') || ua.includes('iphone') || ua.includes('ipad'))
      os = 'iOS';

    return { deviceType, browser, os };
  }

  /**
   * Formata ação para exibição
   */
  private formatAction(action: string): string {
    const actionMap: Record<string, string> = {
      login: 'fez login',
      logout: 'fez logout',
      create_news: 'criou notícia',
      edit_news: 'editou notícia',
      delete_news: 'deletou notícia',
      publish_news: 'publicou notícia',
      create_category: 'criou categoria',
      edit_category: 'editou categoria',
      delete_category: 'deletou categoria',
      create_menu: 'criou menu',
      edit_menu: 'editou menu',
      delete_menu: 'deletou menu',
    };

    return actionMap[action] || action;
  }
}

