import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMediaDto } from './dto/create-media.dto';
import { UpdateMediaDto } from './dto/update-media.dto';
import { MediaResponseDto } from './dto/media-response.dto';
import { ImageProcessingService, ImageSizes } from './services/image-processing.service';

interface UploadMediaData {
  emphasis: boolean;
  author?: string;
  date?: string;
}

@Injectable()
export class MediaService {
  constructor(
    private prisma: PrismaService,
    private imageProcessingService: ImageProcessingService
  ) {}

  async create(createMediaDto: CreateMediaDto): Promise<MediaResponseDto> {
    const media = await this.prisma.media.create({
      data: {
        emphasis: createMediaDto.emphasis,
        imgSize: createMediaDto.imgSize ? JSON.parse(JSON.stringify(createMediaDto.imgSize)) : null,
        author: createMediaDto.author,
        date: createMediaDto.date,
      },
    });

    return this.formatResponse(media);
  }

  async createWithUpload(file: any, data: UploadMediaData): Promise<MediaResponseDto> {
    // Gerar nome único para o arquivo
    const timestamp = Date.now();
    const filename = `media_${timestamp}_${file.originalname}`;
    
    // Processar imagem em diferentes tamanhos
    const imageSizes = await this.imageProcessingService.processImage(file, filename);
    
    // Gerar URLs públicas
    const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
    const publicUrls = this.imageProcessingService.generatePublicUrls(imageSizes, baseUrl);

    // Salvar no banco de dados
    const media = await this.prisma.media.create({
      data: {
        emphasis: data.emphasis,
        imgSize: JSON.parse(JSON.stringify(publicUrls)),
        author: data.author,
        date: data.date,
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
        imgSize: updateMediaDto.imgSize ? JSON.parse(JSON.stringify(updateMediaDto.imgSize)) : existingMedia.imgSize,
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

    // Se existem arquivos de imagem, deletá-los
    if (existingMedia.imgSize) {
      try {
        const imageSizes = existingMedia.imgSize as any;
        await this.imageProcessingService.deleteImageFiles(imageSizes);
      } catch (error) {
        console.error('Erro ao deletar arquivos de imagem:', error);
      }
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