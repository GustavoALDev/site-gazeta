import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { NewsResponseDto } from './dto/news-response.dto';

@Injectable()
export class NewsService {
  constructor(private prisma: PrismaService) {}

  async create(createNewsDto: CreateNewsDto, authorId: number): Promise<NewsResponseDto> {
    // Verificar se já existe notícia com esse slug
    const existingNews = await this.prisma.news.findFirst({
      where: { slug: createNewsDto.slug }
    });

    if (existingNews) {
      throw new ConflictException('Já existe uma notícia com este slug');
    }

    // Verificar se as categorias existem
    const categories = await this.prisma.category.findMany({
      where: {
        id: { in: createNewsDto.categoryId },
        isActive: true
      }
    });

    if (categories.length !== createNewsDto.categoryId.length) {
      throw new NotFoundException('Uma ou mais categorias não foram encontradas');
    }

    // Extrair categoryId do DTO para não incluir na criação da news
    const { categoryId, ...newsData } = createNewsDto;

    // Criar a notícia
    const news = await this.prisma.news.create({
      data: {
        ...newsData,
        authorId,
        newsCategories: {
          create: categoryId.map(catId => ({ categoryId: catId }))
        }
      },
      include: {
        newsCategories: {
          include: {
            category: true
          }
        }
      }
    });

    return this.formatNewsResponse(news);
  }

  async findAll(): Promise<NewsResponseDto[]> {
    const news = await this.prisma.news.findMany({
      include: {
        newsCategories: {
          include: {
            category: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return news.map(this.formatNewsResponse);
  }

  async findOne(id: number): Promise<NewsResponseDto> {
    const news = await this.prisma.news.findFirst({
      where: { id },
      include: {
        newsCategories: {
          include: {
            category: true
          }
        }
      }
    });

    if (!news) {
      throw new NotFoundException('Notícia não encontrada');
    }

    return this.formatNewsResponse(news);
  }

  async findBySlug(slug: string): Promise<NewsResponseDto> {
    const news = await this.prisma.news.findFirst({
      where: { slug },
      include: {
        newsCategories: {
          include: {
            category: true
          }
        }
      }
    });

    if (!news) {
      throw new NotFoundException('Notícia não encontrada');
    }

    return this.formatNewsResponse(news);
  }

  async update(id: number, updateNewsDto: UpdateNewsDto): Promise<NewsResponseDto> {
    // Verificar se a notícia existe
    const existingNews = await this.prisma.news.findFirst({
      where: { id }
    });

    if (!existingNews) {
      throw new NotFoundException('Notícia não encontrada');
    }

    // Verificar conflito de slug se foi fornecido
    if (updateNewsDto.slug && updateNewsDto.slug !== existingNews.slug) {
      const conflictNews = await this.prisma.news.findFirst({
        where: { slug: updateNewsDto.slug, id: { not: id } }
      });

      if (conflictNews) {
        throw new ConflictException('Já existe uma notícia com este slug');
      }
    }

    // Verificar categorias se foram fornecidas
    if (updateNewsDto.categoryId) {
      const categories = await this.prisma.category.findMany({
        where: {
          id: { in: updateNewsDto.categoryId },
          isActive: true
        }
      });

      if (categories.length !== updateNewsDto.categoryId.length) {
        throw new NotFoundException('Uma ou mais categorias não foram encontradas');
      }
    }

    const { categoryId, ...newsData } = updateNewsDto;

    // Atualizar a notícia
    const updatedNews = await this.prisma.$transaction(async (tx) => {
      // Atualizar dados da notícia
      const news = await tx.news.update({
        where: { id },
        data: newsData
      });

      // Atualizar categorias se fornecidas
      if (categoryId) {
        // Remover relacionamentos existentes
        await tx.newsCategory.deleteMany({
          where: { newsId: id }
        });

        // Criar novos relacionamentos
        await tx.newsCategory.createMany({
          data: categoryId.map(catId => ({ newsId: id, categoryId: catId }))
        });
      }

      // Buscar a notícia atualizada com relacionamentos
      return await tx.news.findFirst({
        where: { id },
        include: {
          newsCategories: {
            include: {
              category: true
            }
          }
        }
      });
    });

    return this.formatNewsResponse(updatedNews);
  }

  async remove(id: number): Promise<void> {
    const news = await this.prisma.news.findFirst({
      where: { id }
    });

    if (!news) {
      throw new NotFoundException('Notícia não encontrada');
    }

    await this.prisma.news.delete({
      where: { id }
    });
  }

  async incrementView(id: number): Promise<number> {
    const news = await this.prisma.news.update({
      where: { id, published: true },
      data: { views: { increment: 1 } },
      select: { views: true }
    });

    return news.views;
  }

  private formatNewsResponse(news: any): NewsResponseDto {
    return {
      id: news.id,
      title: news.title,
      subtitle: news.subtitle,
      content: news.content,
      categoryId: news.newsCategories.map(nc => nc.categoryId),
      imgEmphasis: news.imgEmphasis,
      imgEmphasisAuthor: news.imgEmphasisAuthor,
      author: news.author,
      media: news.media,
      published: news.published,
      createdAt: news.createdAt.toISOString(),
      updatedAt: news.updatedAt.toISOString(),
      views: news.views,
      status: news.status,
      validity: news.validity,
      slug: news.slug,
      isEmphasis: news.isEmphasis
    };
  }
} 