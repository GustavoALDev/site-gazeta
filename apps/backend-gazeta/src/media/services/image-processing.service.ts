import { Injectable } from '@nestjs/common';
import sharp from 'sharp';
import * as fs from 'fs';
import * as path from 'path';
import { promisify } from 'util';

const mkdir = promisify(fs.mkdir);
const writeFile = promisify(fs.writeFile);

export interface ImageSizes {
  original: string;
  medium: string;
  small: string;
  superSmall: string;
}

@Injectable()
export class ImageProcessingService {
  private readonly uploadDir = 'uploads/media';
  private readonly imageSizes = {
    original: 'original',
    medium: '500x500',
    small: '300x300',
    superSmall: '150x150'
  };

  async processImage(file: any, filename: string): Promise<ImageSizes> {
    await this.ensureUploadDirectoryExists();

    const originalPath = path.join(this.uploadDir, filename);
    const baseFilename = path.parse(filename).name;
    const extension = '.jpg'; // Vamos padronizar para JPG

    // Salvar imagem original
    await writeFile(originalPath, file.buffer);

    // Processar e gerar diferentes tamanhos
    const imagePaths: ImageSizes = {
      original: originalPath,
      medium: await this.resizeImage(file.buffer, baseFilename, 'medium', 500, 500),
      small: await this.resizeImage(file.buffer, baseFilename, 'small', 300, 300),
      superSmall: await this.resizeImage(file.buffer, baseFilename, 'superSmall', 150, 150)
    };

    return imagePaths;
  }

  private async resizeImage(
    buffer: Buffer,
    baseFilename: string,
    sizeType: string,
    width: number,
    height: number
  ): Promise<string> {
    const filename = `${baseFilename}_${sizeType}.jpg`;
    const outputPath = path.join(this.uploadDir, filename);

    await sharp(buffer)
      .resize(width, height, {
        fit: 'cover',
        position: 'center'
      })
      .jpeg({
        quality: 85,
        progressive: true
      })
      .toFile(outputPath);

    return outputPath;
  }

  private async ensureUploadDirectoryExists(): Promise<void> {
    try {
      await mkdir(this.uploadDir, { recursive: true });
    } catch (error: any) {
      if (error.code !== 'EEXIST') {
        throw error;
      }
    }
  }

  async deleteImageFiles(imageSizes: ImageSizes): Promise<void> {
    const paths = Object.values(imageSizes);
    
    for (const imagePath of paths) {
      try {
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      } catch (error) {
        console.error(`Erro ao deletar arquivo ${imagePath}:`, error);
      }
    }
  }

  generatePublicUrls(imageSizes: ImageSizes, baseUrl: string): ImageSizes {
    return {
      original: `${baseUrl}/${imageSizes.original}`,
      medium: `${baseUrl}/${imageSizes.medium}`,
      small: `${baseUrl}/${imageSizes.small}`,
      superSmall: `${baseUrl}/${imageSizes.superSmall}`
    };
  }
} 