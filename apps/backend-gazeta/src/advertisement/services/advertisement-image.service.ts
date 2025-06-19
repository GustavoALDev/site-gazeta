import { Injectable, BadRequestException } from '@nestjs/common';
import { ImageProcessingService } from '../../media/services/image-processing.service';
import * as path from 'path';
import * as fs from 'fs/promises';

@Injectable()
export class AdvertisementImageService {
  constructor(private imageProcessingService: ImageProcessingService) {}

  async uploadAdvertisementImage(file: any): Promise<string> {
    if (!file) {
      throw new BadRequestException('Nenhuma imagem foi enviada');
    }

    // Validar tipo de arquivo
    const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedMimes.includes(file.mimetype)) {
      throw new BadRequestException('Tipo de arquivo não permitido. Use: JPG, PNG, GIF ou WebP');
    }

    // Validar tamanho (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      throw new BadRequestException('Arquivo muito grande. Tamanho máximo: 5MB');
    }

    try {
      // Gerar nome único para o arquivo
      const timestamp = Date.now();
      const extension = path.extname(file.originalname);
      const filename = `advertisement_${timestamp}${extension}`;
      
      // Criar diretório se não existir
      const uploadsDir = path.join(process.cwd(), 'uploads', 'advertisements');
      await fs.mkdir(uploadsDir, { recursive: true });
      
      // Salvar arquivo
      const filePath = path.join(uploadsDir, filename);
      await fs.writeFile(filePath, file.buffer);
      
      // Gerar URL pública
      const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
      const publicUrl = `${baseUrl}/uploads/advertisements/${filename}`;
      
      return publicUrl;
    } catch (error) {
      throw new BadRequestException('Erro ao fazer upload da imagem: ' + error.message);
    }
  }

  async deleteAdvertisementImage(imageUrl: string): Promise<void> {
    try {
      // Extrair nome do arquivo da URL
      const filename = path.basename(imageUrl);
      const filePath = path.join(process.cwd(), 'uploads', 'advertisements', filename);
      
      // Verificar se arquivo existe e deletar
      try {
        await fs.access(filePath);
        await fs.unlink(filePath);
      } catch (error) {
        // Arquivo não existe, ignorar erro
      }
    } catch (error) {
      // Log do erro mas não lançar exceção para não quebrar a exclusão do anúncio
      console.error('Erro ao deletar imagem do anúncio:', error);
    }
  }
} 