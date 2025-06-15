import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateNewsVideoDto } from './dto/create-news-video.dto';
import { UpdateNewsVideoDto } from './dto/update-news-video.dto';
import { NewsVideoResponseDto } from './dto/news-video-response.dto';

@Injectable()
export class NewsVideoService {
  constructor(private prisma: PrismaService) {}

  async create(createNewsVideoDto: CreateNewsVideoDto): Promise<NewsVideoResponseDto> {
    // Verificar se a notícia existe
    const newsExists = await this.prisma.news.findUnique({
      where: { id: createNewsVideoDto.newsId }
    });

    if (!newsExists) {
      throw new NotFoundException('Notícia não encontrada');
    }

    const newsVideo = await this.prisma.newsVideo.create({
      data: {
        url: createNewsVideoDto.url,
        thumbnail: createNewsVideoDto.thumbnail,
        newsId: createNewsVideoDto.newsId,
      },
      include: {
        news: {
          select: {
            id: true,
            title: true,
            slug: true,
          }
        }
      }
    });

    return {
      id: newsVideo.id,
      url: newsVideo.url,
      thumbnail: newsVideo.thumbnail,
      newsId: newsVideo.newsId,
      news: newsVideo.news
    };
  }

  async findAll(): Promise<NewsVideoResponseDto[]> {
    const newsVideos = await this.prisma.newsVideo.findMany({
      include: {
        news: {
          select: {
            id: true,
            title: true,
            slug: true,
          }
        }
      },
      orderBy: {
        id: 'desc'
      }
    });

    return newsVideos.map(video => ({
      id: video.id,
      url: video.url,
      thumbnail: video.thumbnail,
      newsId: video.newsId,
      news: video.news
    }));
  }

  async findOne(id: number): Promise<NewsVideoResponseDto> {
    const newsVideo = await this.prisma.newsVideo.findUnique({
      where: { id },
      include: {
        news: {
          select: {
            id: true,
            title: true,
            slug: true,
          }
        }
      }
    });

    if (!newsVideo) {
      throw new NotFoundException('Vídeo não encontrado');
    }

    return {
      id: newsVideo.id,
      url: newsVideo.url,
      thumbnail: newsVideo.thumbnail,
      newsId: newsVideo.newsId,
      news: newsVideo.news
    };
  }

  async findByNewsId(newsId: number): Promise<NewsVideoResponseDto[]> {
    const newsVideos = await this.prisma.newsVideo.findMany({
      where: { newsId },
      include: {
        news: {
          select: {
            id: true,
            title: true,
            slug: true,
          }
        }
      },
      orderBy: {
        id: 'desc'
      }
    });

    return newsVideos.map(video => ({
      id: video.id,
      url: video.url,
      thumbnail: video.thumbnail,
      newsId: video.newsId,
      news: video.news
    }));
  }

  async update(id: number, updateNewsVideoDto: UpdateNewsVideoDto): Promise<NewsVideoResponseDto> {
    // Verificar se o vídeo existe
    const existingVideo = await this.prisma.newsVideo.findUnique({
      where: { id }
    });

    if (!existingVideo) {
      throw new NotFoundException('Vídeo não encontrado');
    }

    // Se está atualizando o newsId, verificar se a notícia existe
    if (updateNewsVideoDto.newsId && updateNewsVideoDto.newsId !== existingVideo.newsId) {
      const newsExists = await this.prisma.news.findUnique({
        where: { id: updateNewsVideoDto.newsId }
      });

      if (!newsExists) {
        throw new NotFoundException('Notícia não encontrada');
      }
    }

    const updatedVideo = await this.prisma.newsVideo.update({
      where: { id },
      data: {
        ...(updateNewsVideoDto.url && { url: updateNewsVideoDto.url }),
        ...(updateNewsVideoDto.thumbnail && { thumbnail: updateNewsVideoDto.thumbnail }),
        ...(updateNewsVideoDto.newsId && { newsId: updateNewsVideoDto.newsId }),
      },
      include: {
        news: {
          select: {
            id: true,
            title: true,
            slug: true,
          }
        }
      }
    });

    return {
      id: updatedVideo.id,
      url: updatedVideo.url,
      thumbnail: updatedVideo.thumbnail,
      newsId: updatedVideo.newsId,
      news: updatedVideo.news
    };
  }

  async remove(id: number): Promise<{ message: string }> {
    const existingVideo = await this.prisma.newsVideo.findUnique({
      where: { id }
    });

    if (!existingVideo) {
      throw new NotFoundException('Vídeo não encontrado');
    }

    await this.prisma.newsVideo.delete({
      where: { id }
    });

    return { message: 'Vídeo deletado com sucesso' };
  }
} 