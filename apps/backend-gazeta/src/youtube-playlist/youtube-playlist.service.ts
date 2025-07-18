import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateYoutubePlaylistDto } from './dto/create-youtube-playlist.dto';
import { UpdateYoutubePlaylistDto } from './dto/update-youtube-playlist.dto';
import { YoutubePlaylistResponseDto } from './dto/youtube-playlist-response.dto';
import { ReorderPlaylistDto } from './dto/reorder-playlist.dto';

@Injectable()
export class YoutubePlaylistService {
  constructor(private prisma: PrismaService) {}

  async create(createDto: CreateYoutubePlaylistDto, userId: number): Promise<YoutubePlaylistResponseDto> {
    // Verificar se já existe um vídeo com a mesma ordem
    const existingOrder = await this.prisma.youtubePlaylist.findFirst({
      where: { displayOrder: createDto.displayOrder }
    });

    if (existingOrder) {
      throw new ConflictException('Já existe um vídeo com esta ordem de exibição');
    }

    // Verificar se já existe o mesmo videoId
    const existingVideo = await this.prisma.youtubePlaylist.findFirst({
      where: { videoId: createDto.videoId }
    });

    if (existingVideo) {
      throw new ConflictException('Este vídeo já está na playlist');
    }

    const video = await this.prisma.youtubePlaylist.create({
      data: {
        ...createDto,
        publishedAt: createDto.publishedAt ? new Date(createDto.publishedAt) : null,
        createdBy: userId
      },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    return video;
  }

  async findAll(includeInactive = false): Promise<YoutubePlaylistResponseDto[]> {
    const where = includeInactive ? {} : { isActive: true };

    return this.prisma.youtubePlaylist.findMany({
      where,
      orderBy: {
        displayOrder: 'asc'
      },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });
  }

  async findAllActive(): Promise<YoutubePlaylistResponseDto[]> {
    return this.prisma.youtubePlaylist.findMany({
      where: { isActive: true },
      orderBy: {
        displayOrder: 'asc'
      },
      select: {
        id: true,
        title: true,
        description: true,
        youtubeUrl: true,
        thumbnail: true,
        duration: true,
        videoId: true,
        displayOrder: true,
        isActive: true,
        isEmphasis: true,
        publishedAt: true,
        createdAt: true,
        updatedAt: true,
        createdBy: true
      }
    });
  }

  async findOne(id: number): Promise<YoutubePlaylistResponseDto> {
    const video = await this.prisma.youtubePlaylist.findUnique({
      where: { id },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    if (!video) {
      throw new NotFoundException('Vídeo não encontrado');
    }

    return video;
  }

  async update(id: number, updateDto: UpdateYoutubePlaylistDto): Promise<YoutubePlaylistResponseDto> {
    // Verificar se o vídeo existe
    const existingVideo = await this.prisma.youtubePlaylist.findUnique({
      where: { id }
    });

    if (!existingVideo) {
      throw new NotFoundException('Vídeo não encontrado');
    }

    // Verificar conflitos de ordem, se estiver sendo alterada
    if (updateDto.displayOrder && updateDto.displayOrder !== existingVideo.displayOrder) {
      const orderConflict = await this.prisma.youtubePlaylist.findFirst({
        where: { 
          displayOrder: updateDto.displayOrder,
          id: { not: id }
        }
      });

      if (orderConflict) {
        throw new ConflictException('Já existe um vídeo com esta ordem de exibição');
      }
    }

    // Verificar conflitos de videoId, se estiver sendo alterado
    if (updateDto.videoId && updateDto.videoId !== existingVideo.videoId) {
      const videoIdConflict = await this.prisma.youtubePlaylist.findFirst({
        where: { 
          videoId: updateDto.videoId,
          id: { not: id }
        }
      });

      if (videoIdConflict) {
        throw new ConflictException('Este vídeo já está na playlist');
      }
    }

    const updatedVideo = await this.prisma.youtubePlaylist.update({
      where: { id },
      data: {
        ...updateDto,
        publishedAt: updateDto.publishedAt ? new Date(updateDto.publishedAt) : undefined
      },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    return updatedVideo;
  }

  async remove(id: number): Promise<void> {
    const video = await this.prisma.youtubePlaylist.findUnique({
      where: { id }
    });

    if (!video) {
      throw new NotFoundException('Vídeo não encontrado');
    }

    await this.prisma.youtubePlaylist.update({
      where: { id },
      data: { isActive: false }
    });
  }

  async permanentDelete(id: number): Promise<void> {
    const video = await this.prisma.youtubePlaylist.findUnique({
      where: { id }
    });

    if (!video) {
      throw new NotFoundException('Vídeo não encontrado');
    }

    if (video.isActive) {
      throw new ConflictException('Só é possível excluir permanentemente vídeos inativos');
    }

    await this.prisma.youtubePlaylist.delete({
      where: { id }
    });
  }

  async reorderPlaylist(reorderDto: ReorderPlaylistDto): Promise<YoutubePlaylistResponseDto[]> {
    const { videoIds } = reorderDto;

    // Verificar se todos os IDs existem
    const videos = await this.prisma.youtubePlaylist.findMany({
      where: {
        id: { in: videoIds }
      }
    });

    if (videos.length !== videoIds.length) {
      throw new BadRequestException('Um ou mais vídeos não foram encontrados');
    }

    // Atualizar a ordem dos vídeos
    const updatePromises = videoIds.map((videoId, index) => 
      this.prisma.youtubePlaylist.update({
        where: { id: videoId },
        data: { displayOrder: index + 1 }
      })
    );

    await Promise.all(updatePromises);

    // Retornar a playlist atualizada
    return this.findAll();
  }

  async getNextDisplayOrder(): Promise<number> {
    const lastVideo = await this.prisma.youtubePlaylist.findFirst({
      orderBy: {
        displayOrder: 'desc'
      }
    });

    return lastVideo ? lastVideo.displayOrder + 1 : 1;
  }
} 