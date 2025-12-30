import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class NewsAnalyticsService {
  constructor(private prisma: PrismaService) {}

  /**
   * Incrementa o contador de visualizações de uma notícia publicada
   */
  async incrementView(id: number): Promise<number> {
    const news = await this.prisma.news.update({
      where: { id, published: 'true' },
      data: { views: { increment: 1 } },
      select: { views: true }
    });

    if (!news) {
      throw new NotFoundException('Notícia não encontrada ou não publicada');
    }

    return news.views;
  }
}

