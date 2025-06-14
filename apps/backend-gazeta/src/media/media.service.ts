import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMediaDto } from './dto/create-media.dto';
import { UpdateMediaDto } from './dto/update-media.dto';
import { MediaResponseDto } from './dto/media-response.dto';

@Injectable()
export class MediaService {
  constructor(private prisma: PrismaService) {}

  async create(createMediaDto: CreateMediaDto): Promise<MediaResponseDto> {
    const media = await this.prisma.media.create({
      data: {
        emphasis: createMediaDto.emphasis,
        imgSize: createMediaDto.imgSize || null,
        author: createMediaDto.author,
        date: createMediaDto.date,
      },
    });

    return this.formatResponse(media);
  }

  async findAll(): Promise<MediaResponseDto[]> {
    const medias = await this.prisma.media.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return medias.map(media => this.formatResponse(media));
  }

  async findOne(id: number): Promise<MediaResponseDto> {
    const media = await this.prisma.media.findUnique({
      where: { id },
    });

    if (!media) {
      throw new NotFoundException(`Mídia com ID ${id} não encontrada`);
    }

    return this.formatResponse(media);
  }

  async update(id: number, updateMediaDto: UpdateMediaDto): Promise<MediaResponseDto> {
    const existingMedia = await this.prisma.media.findUnique({
      where: { id },
    });

    if (!existingMedia) {
      throw new NotFoundException(`Mídia com ID ${id} não encontrada`);
    }

    const updatedMedia = await this.prisma.media.update({
      where: { id },
      data: {
        emphasis: updateMediaDto.emphasis,
        imgSize: updateMediaDto.imgSize || existingMedia.imgSize,
        author: updateMediaDto.author,
        date: updateMediaDto.date,
      },
    });

    return this.formatResponse(updatedMedia);
  }

  async remove(id: number): Promise<{ message: string }> {
    const existingMedia = await this.prisma.media.findUnique({
      where: { id },
    });

    if (!existingMedia) {
      throw new NotFoundException(`Mídia com ID ${id} não encontrada`);
    }

    await this.prisma.media.delete({
      where: { id },
    });

    return { message: 'Mídia removida com sucesso' };
  }

  private formatResponse(media: any): MediaResponseDto {
    return {
      id: media.id,
      emphasis: media.emphasis,
      imgSize: media.imgSize ? JSON.parse(JSON.stringify(media.imgSize)) : null,
      author: media.author,
      date: media.date,
      createdAt: media.createdAt.toISOString(),
      updatedAt: media.updatedAt.toISOString(),
    };
  }
} 