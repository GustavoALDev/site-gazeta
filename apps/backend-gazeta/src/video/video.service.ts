import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateVideoDto } from './dto/create-video.dto';
import { UpdateVideoDto } from './dto/update-video.dto';
import { VideoResponseDto } from './dto/video-response.dto';
import { UploadVideoDto } from './dto/upload-video.dto';
import { VideoProcessingService } from './services/video-processing.service';

@Injectable()
export class VideoService {
  private readonly logger = new Logger(VideoService.name);

  constructor(
    private prisma: PrismaService,
    private videoProcessingService: VideoProcessingService
  ) {}

  async create(createVideoDto: CreateVideoDto): Promise<VideoResponseDto> {
    const video = await this.prisma.video.create({
      data: {
        title: createVideoDto.title,
        url: createVideoDto.url || '',
        thumbnail: createVideoDto.thumbnail,
        duration: createVideoDto.duration,
      },
    });

    return this.formatResponse(video);
  }

  async createWithUpload(
    videoFile: any,
    thumbnailFile: any | undefined,
    data: UploadVideoDto
  ): Promise<VideoResponseDto> {
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(2, 15);
    const videoFilename = `video_${timestamp}_${randomId}_${videoFile.originalname}`;
    
    // Salvar vídeo
    const videoPath = await this.videoProcessingService.saveVideo(videoFile, videoFilename);
    
    // Gerar URL pública do vídeo
    const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
    const videoUrl = this.videoProcessingService.generatePublicUrl(videoPath, baseUrl);
    
    // Processar thumbnail se fornecido
    let thumbnailUrl: string | undefined;
    if (thumbnailFile) {
      const thumbnailPath = await this.videoProcessingService.saveThumbnail(
        thumbnailFile,
        videoFilename
      );
      thumbnailUrl = this.videoProcessingService.generatePublicUrl(thumbnailPath, baseUrl);
    }

    // Salvar no banco de dados
    const video = await this.prisma.video.create({
      data: {
        title: data.title,
        url: videoUrl,
        thumbnail: thumbnailUrl,
        duration: data.duration,
      },
    });

    return this.formatResponse(video);
  }

  async findAll(): Promise<VideoResponseDto[]> {
    const videos = await this.prisma.video.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return videos.map(video => this.formatResponse(video));
  }

  async findOne(id: number): Promise<VideoResponseDto> {
    const video = await this.prisma.video.findUnique({
      where: { id },
    });

    if (!video) {
      throw new NotFoundException(`Vídeo com ID ${id} não encontrado`);
    }

    return this.formatResponse(video);
  }

  async update(id: number, updateVideoDto: UpdateVideoDto): Promise<VideoResponseDto> {
    const existingVideo = await this.findVideoById(id);

    const updatedVideo = await this.prisma.video.update({
      where: { id },
      data: {
        title: updateVideoDto.title ?? existingVideo.title,
        url: updateVideoDto.url ?? existingVideo.url,
        thumbnail: updateVideoDto.thumbnail ?? existingVideo.thumbnail,
        duration: updateVideoDto.duration ?? existingVideo.duration,
      },
    });

    return this.formatResponse(updatedVideo);
  }

  async remove(id: number): Promise<{ message: string }> {
    const existingVideo = await this.findVideoById(id);

    // Deletar arquivos físicos
    try {
      const videoPath = existingVideo.url.replace(process.env.BASE_URL || 'http://localhost:3000', '').substring(1);
      const thumbnailPath = existingVideo.thumbnail 
        ? existingVideo.thumbnail.replace(process.env.BASE_URL || 'http://localhost:3000', '').substring(1)
        : undefined;
      
      await this.videoProcessingService.deleteVideoFiles(videoPath, thumbnailPath);
    } catch (error) {
      this.logger.error(`Erro ao deletar arquivos de vídeo ${id}:`, error);
      // Não interrompe a exclusão do registro no banco
    }

    await this.prisma.video.delete({
      where: { id },
    });

    return { message: 'Vídeo removido com sucesso' };
  }

  private async findVideoById(id: number) {
    const video = await this.prisma.video.findUnique({
      where: { id },
    });

    if (!video) {
      throw new NotFoundException(`Vídeo com ID ${id} não encontrado`);
    }

    return video;
  }

  private formatResponse(video: any): VideoResponseDto {
    return {
      id: video.id,
      title: video.title,
      url: video.url,
      thumbnail: video.thumbnail,
      duration: video.duration,
      createdAt: video.createdAt?.toISOString() || new Date().toISOString(),
      updatedAt: video.updatedAt?.toISOString() || new Date().toISOString(),
    };
  }
}

