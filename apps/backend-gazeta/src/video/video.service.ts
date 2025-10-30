import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateVideoDto } from './dto/create-video.dto';
import { UpdateVideoDto } from './dto/update-video.dto';
import { VideoResponseDto } from './dto/video-response.dto';
import { UploadVideoDto } from './dto/upload-video.dto';
import { VideoProcessingService } from './services/video-processing.service';
import { VideoMetadataService } from './services/video-metadata.service';
type UploadedFile = { originalname: string; buffer: Buffer; mimetype: string };

@Injectable()
export class VideoService {
  private readonly logger = new Logger(VideoService.name);

  constructor(
    private prisma: PrismaService,
    private videoProcessingService: VideoProcessingService,
    private videoMetadataService: VideoMetadataService
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
    videoFile: UploadedFile,
    thumbnailFile: UploadedFile | undefined,
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

    // Descobrir duração automaticamente se não enviada
    let effectiveDuration = data.duration;
    if (!effectiveDuration) {
      try {
        effectiveDuration = await this.videoMetadataService.getDurationString(videoPath);
      } catch (e) {
        this.logger.warn(`Não foi possível calcular a duração via ffprobe: ${e?.message || e}`);
      }
    }

    // Salvar no banco de dados
    const video = await this.prisma.video.create({
      data: {
        title: data.title,
        url: videoUrl,
        thumbnail: thumbnailUrl,
        duration: effectiveDuration,
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

  async updateWithUpload(
    id: number,
    videoFile?: UploadedFile,
    thumbnailFile?: UploadedFile,
    data?: { title?: string; duration?: string }
  ): Promise<VideoResponseDto> {
    const existingVideo = await this.findVideoById(id);

    const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
    let newVideoUrl = existingVideo.url;
    let newThumbnailUrl = existingVideo.thumbnail;
    let effectiveDuration = data?.duration ?? existingVideo.duration;

    let oldVideoPathToDelete: string | undefined;
    let oldThumbPathToDelete: string | undefined;
    let newVideoRelPath: string | undefined;
    let newThumbRelPath: string | undefined;

    // Atualizar vídeo se enviado
    let newVideoFilename: string | undefined;
    if (videoFile) {
      const timestamp = Date.now();
      const randomId = Math.random().toString(36).substring(2, 15);
      newVideoFilename = `video_${timestamp}_${randomId}_${videoFile.originalname}`;

      const newVideoPath = await this.videoProcessingService.saveVideo(videoFile, newVideoFilename);
      newVideoRelPath = newVideoPath.replace(/\\/g, '/');
      newVideoUrl = this.videoProcessingService.generatePublicUrl(newVideoPath, baseUrl);

      // Recalcular duração se não enviada
      if (!data?.duration) {
        try {
          effectiveDuration = await this.videoMetadataService.getDurationString(newVideoPath);
        } catch (e) {
          this.logger.warn(`Não foi possível calcular a duração via ffprobe: ${e?.message || e}`);
        }
      }

      // Marcar vídeo antigo para deleção
      if (existingVideo.url) {
        const oldRel = existingVideo.url.replace(baseUrl, '').replace(/^\//, '');
        // Só deletar se o caminho antigo for diferente do novo
        oldVideoPathToDelete = newVideoRelPath && oldRel === newVideoRelPath ? undefined : oldRel;
      }
    }

    // Atualizar thumbnail se enviado
    if (thumbnailFile) {
      // Se não trocou o vídeo, derivar o nome base a partir do URL existente
      const filenameForThumbnail = newVideoFilename || this.extractFilenameFromUrl(existingVideo.url, baseUrl) || `video_${Date.now()}.mp4`;
      const thumbnailPath = await this.videoProcessingService.saveThumbnail(thumbnailFile, filenameForThumbnail);
      newThumbRelPath = thumbnailPath.replace(/\\/g, '/');
      newThumbnailUrl = this.videoProcessingService.generatePublicUrl(thumbnailPath, baseUrl);

      // Marcar thumbnail antiga para deleção
      if (existingVideo.thumbnail) {
        const oldRel = existingVideo.thumbnail.replace(baseUrl, '').replace(/^\//, '');
        // Se o caminho novo for igual ao antigo, não deletar (foi overwrite no mesmo arquivo)
        oldThumbPathToDelete = newThumbRelPath && oldRel === newThumbRelPath ? undefined : oldRel;
      }
    }

    const updatedVideo = await this.prisma.video.update({
      where: { id },
      data: {
        title: data?.title ?? existingVideo.title,
        url: newVideoUrl,
        thumbnail: newThumbnailUrl,
        duration: effectiveDuration,
      },
    });

    // Deletar arquivos antigos substituídos
    try {
      if (oldVideoPathToDelete || oldThumbPathToDelete) {
        await this.videoProcessingService.deleteVideoFiles(oldVideoPathToDelete, oldThumbPathToDelete);
      }
    } catch (error) {
      this.logger.error(`Erro ao deletar arquivos substituídos do vídeo ${id}:`, error);
    }

    return this.formatResponse(updatedVideo);
  }

  private extractFilenameFromUrl(url: string, baseUrl: string): string | undefined {
    try {
      const withoutBase = url.replace(baseUrl, '');
      const parts = withoutBase.split('/');
      return parts[parts.length - 1] || undefined;
    } catch {
      return undefined;
    }
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

