import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { NewsResponseDto } from '../dto/news-response.dto';
import { NewsQueryDto } from '../dto/news-query.dto';
import { NewsStatus } from '../dto/news-status.enum';
import { NewsFormatterService } from '../core/news-formatter.service';

@Injectable()
export class NewsQueryService {
  constructor(
    private prisma: PrismaService,
    private formatter: NewsFormatterService
  ) {}

  /**
   * Inclui padrão para queries de notícias
   */
  private getNewsInclude() {
    return {
      newsCategories: {
        include: {
          category: true
        }
      },
      mediaNews: true,
      videoNews: true
    };
  }

  /**
   * Converte string de IDs para array de números
   */
  private parseExcludeIds(exclude?: string): number[] {
    if (!exclude) return [];
    
    return exclude
      .split(',')
      .map(id => parseInt(id.trim(), 10))
      .filter(id => !isNaN(id));
  }

  /**
   * Constrói condições WHERE para queries
   */
  private buildWhereCondition(query?: NewsQueryDto): any {
    const whereCondition: any = {};

    // Filtro de status: status específico tem prioridade sobre includeTrash
    if (query?.status) {
      // Se um status específico foi fornecido, usar ele
      whereCondition.status = query.status;
    } else if (query?.includeTrash) {
      // Se includeTrash=true mas não há status específico, não filtrar por status (inclui tudo)
      // Não adiciona filtro de status - mostra todos os status (ACTIVE, INACTIVE, TRASH)
    } else {
      // Padrão: apenas ACTIVE se nenhum filtro foi aplicado
      whereCondition.status = NewsStatus.ACTIVE;
    }

    // Filtro de exclusão de IDs
    if (query?.exclude) {
      const excludeIds = query.exclude
        .split(',')
        .map(id => parseInt(id.trim(), 10))
        .filter(id => !isNaN(id));
      
      if (excludeIds.length > 0) {
        whereCondition.id = { notIn: excludeIds };
      }
    }

    return whereCondition;
  }

  /**
   * Lista todas as notícias com filtros
   */
  async findAll(query?: NewsQueryDto): Promise<NewsResponseDto[]> {
    const whereCondition = this.buildWhereCondition(query);

    const news = await this.prisma.news.findMany({
      where: whereCondition,
      include: this.getNewsInclude(),
      orderBy: { createdAt: 'desc' }
    });

    return this.formatter.formatManyNewsResponse(news);
  }

  /**
   * Busca notícias por termo de busca
   */
  async search(searchTerm: string, limit = 50): Promise<NewsResponseDto[]> {
    const normalizedSearch = searchTerm.trim();

    const news = await this.prisma.news.findMany({
      where: {
        AND: [
          // Apenas notícias ativas
          { status: NewsStatus.ACTIVE },
          // Buscar em título, subtítulo ou nome da categoria
          {
            OR: [
              { title: { contains: normalizedSearch } },
              { subtitle: { contains: normalizedSearch } },
              {
                newsCategories: {
                  some: {
                    category: {
                      name: { contains: normalizedSearch }
                    }
                  }
                }
              }
            ]
          }
        ]
      },
      include: this.getNewsInclude(),
      orderBy: [
        { isEmphasis: 'desc' }, // Notícias em destaque primeiro
        { views: 'desc' },       // Depois por views
        { createdAt: 'desc' }    // E por data
      ],
      take: limit
    });

    return this.formatter.formatManyNewsResponse(news);
  }

  /**
   * Busca notícias em destaque
   */
  async findFeatured(exclude?: string): Promise<NewsResponseDto[]> {
    const excludeIds = this.parseExcludeIds(exclude);
    
    const whereCondition: any = {
      status: NewsStatus.ACTIVE,
      isEmphasis: true
    };

    if (excludeIds.length > 0) {
      whereCondition.id = { notIn: excludeIds };
    }

    const news = await this.prisma.news.findMany({
      where: whereCondition,
      include: this.getNewsInclude(),
      orderBy: [
        { views: 'desc' },      // Por views
        { createdAt: 'desc' }   // E por data
      ]
    });

    return this.formatter.formatManyNewsResponse(news, true);
  }

  /**
   * Busca últimas notícias recentes
   * NOTA: Este endpoint é uma exceção e NÃO filtra IDs excluídos.
   * Sempre retorna as notícias mais recentes, mesmo que já tenham sido exibidas.
   */
  async findLatestNews(exclude?: string, limit = 5): Promise<NewsResponseDto[]> {
    const news = await this.prisma.news.findMany({
      where: {
        status: NewsStatus.ACTIVE
      },
      include: this.getNewsInclude(),
      orderBy: { createdAt: 'desc' },
      take: limit
    });

    return this.formatter.formatManyNewsResponse(news, true);
  }

  /**
   * Busca notícias mais vistas dos últimos 7 dias
   */
  async findMostViewed(limit = 9): Promise<NewsResponseDto[]> {
    // Calcular data de 7 dias atrás
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    const whereCondition: any = {
      status: NewsStatus.ACTIVE,
      createdAt: {
        gte: oneWeekAgo
      }
    };

    const news = await this.prisma.news.findMany({
      where: whereCondition,
      include: this.getNewsInclude(),
      orderBy: { views: 'desc' },
      take: limit
    });

    return this.formatter.formatManyNewsResponse(news, true);
  }

  /**
   * Busca notícias relacionadas baseadas nas categorias
   */
  async findRelatedNews(newsId: number): Promise<NewsResponseDto[]> {
    // Buscar a notícia atual
    const currentNews = await this.prisma.news.findFirst({
      where: { id: newsId },
      include: {
        newsCategories: true
      }
    });

    if (!currentNews) {
      throw new NotFoundException('Notícia não encontrada');
    }

    // Pegar os IDs das categorias da notícia atual
    const categoryIds = currentNews.newsCategories.map(nc => nc.categoryId);

    if (categoryIds.length === 0) {
      return [];
    }

    // Buscar notícias relacionadas por categoria
    const relatedNewsMap = new Map<number, NewsResponseDto>();

    // Para cada categoria, buscar 3 notícias aleatórias
    for (const categoryId of categoryIds) {
      const categoryNews = await this.prisma.news.findMany({
        where: {
          status: NewsStatus.ACTIVE,
          id: { not: newsId },
          newsCategories: {
            some: { categoryId: categoryId }
          }
        },
        include: this.getNewsInclude()
      });

      // Embaralhar e pegar até 3 notícias
      const newsToTake = Math.min(categoryNews.length, 3);
      const shuffled = [...categoryNews].sort(() => Math.random() - 0.5);
      const selectedNews = shuffled.slice(0, newsToTake);

      // Adicionar ao mapa (evita duplicatas)
      selectedNews.forEach(newsItem => {
        if (!relatedNewsMap.has(newsItem.id)) {
          relatedNewsMap.set(
            newsItem.id,
            this.formatter.formatNewsResponseWithTags(newsItem)
          );
        }
      });
    }

    return Array.from(relatedNewsMap.values());
  }

  /**
   * Busca notícias por categoria específica
   */
  async findByCategory(categoryId: number, exclude?: string): Promise<NewsResponseDto[]> {
    const excludeIds = this.parseExcludeIds(exclude);
    
    const whereCondition: any = {
      status: NewsStatus.ACTIVE,
      newsCategories: {
        some: {
          categoryId: categoryId
        }
      }
    };

    if (excludeIds.length > 0) {
      whereCondition.id = { notIn: excludeIds };
    }

    const news = await this.prisma.news.findMany({
      where: whereCondition,
      include: this.getNewsInclude(),
      orderBy: { createdAt: 'desc' }
    });

    return this.formatter.formatManyNewsResponse(news);
  }
}

