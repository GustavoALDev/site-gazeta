import { Injectable, Logger } from '@nestjs/common';
import { writeFile, mkdir, unlink } from 'fs/promises';
import * as path from 'path';
import sharp from 'sharp';

@Injectable()
export class VideoProcessingService {
  private readonly logger = new Logger(VideoProcessingService.name);
  private readonly uploadDir = 'uploads/videos';

  async saveVideo(file: any, filename: string): Promise<string> {
    await this.ensureUploadDirectoryExists();
    
    const videoPath = path.join(this.uploadDir, filename);
    await writeFile(videoPath, file.buffer);
    
    return videoPath;
  }

  async saveThumbnail(file: any, videoFilename: string): Promise<string> {
    await this.ensureUploadDirectoryExists();
    
    const baseFilename = path.parse(videoFilename).name;
    const thumbnailFilename = `${baseFilename}_thumb.jpg`;
    const thumbnailPath = path.join(this.uploadDir, thumbnailFilename);
    
    // Se for uma imagem, processamos com Sharp
    if (file.mimetype.startsWith('image/')) {
      await sharp(file.buffer)
        .resize(640, 360, {
          fit: 'cover',
          position: 'center'
        })
        .jpeg({
          quality: 85,
          progressive: true
        })
        .toFile(thumbnailPath);
    } else {
      // Se for outro tipo de arquivo, apenas salvamos
      await writeFile(thumbnailPath, file.buffer);
    }
    
    return thumbnailPath;
  }

  generatePublicUrl(filePath: string, baseUrl: string): string {
    // Remove o prefixo 'uploads/' se existir para manter consistência
    const relativePath = filePath.replace(/\\/g, '/');
    return `${baseUrl}/${relativePath}`;
  }

  async deleteVideoFiles(videoPath: string, thumbnailPath?: string): Promise<void> {
    try {
      await unlink(videoPath);
      this.logger.log(`Arquivo de vídeo deletado: ${videoPath}`);
      
      if (thumbnailPath) {
        await unlink(thumbnailPath);
        this.logger.log(`Arquivo de thumbnail deletado: ${thumbnailPath}`);
      }
    } catch (error) {
      this.logger.error(`Erro ao deletar arquivos: ${error.message}`);
      throw error;
    }
  }

  private async ensureUploadDirectoryExists(): Promise<void> {
    try {
      await mkdir(this.uploadDir, { recursive: true });
    } catch (error) {
      this.logger.error(`Erro ao criar diretório de upload: ${error.message}`);
      throw error;
    }
  }
}

