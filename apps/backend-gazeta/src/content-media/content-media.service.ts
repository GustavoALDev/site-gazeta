import { Injectable, Logger, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ContentMediaResponseDto } from './dto/content-media-response.dto';
import * as fs from 'fs';
import * as path from 'path';
import { promisify } from 'util';
import sharp from 'sharp';
import { sanitizeFileName } from '../utils/file-name-sanitizer';

const mkdir = promisify(fs.mkdir);
const unlink = promisify(fs.unlink);
const readdir = promisify(fs.readdir);

@Injectable()
export class ContentMediaService {
  private readonly logger = new Logger(ContentMediaService.name);
  private readonly baseUploadDir = 'uploads';

  constructor(private prisma: PrismaService) {}

  /**
   * Faz upload de uma imagem de conteúdo (apenas tamanho original)
   */
  async uploadContentMedia(
    file: any,
    baseUrl: string
  ): Promise<ContentMediaResponseDto> {
    if (!file) {
      throw new BadRequestException('Arquivo não fornecido');
    }

    // Validar tipo de arquivo
    const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException('Tipo de arquivo não permitido. Use JPG, PNG ou WEBP');
    }

    // Gerar nome único para o arquivo (formato: {timestamp}_{nome_sanitizado})
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(2, 15);
    const sanitizedOriginalName = sanitizeFileName(file.originalname);
    const filename = `${timestamp}_${randomId}_${sanitizedOriginalName}`;

    // Criar diretório baseado no timestamp
    const timestampDir = path.join(this.baseUploadDir, timestamp.toString());
    await this.ensureUploadDirectoryExists(timestampDir);

    // Converter para WebP e salvar
    const baseFilename = path.parse(sanitizedOriginalName).name;
    const webpFilename = `${baseFilename}.webp`;
    const filePath = path.join(timestampDir, webpFilename);
    await this.convertToWebP(file.buffer, filePath);

    // Gerar URL pública (com extensão .webp)
    const publicUrl = `${baseUrl}/uploads/${timestamp}/${webpFilename}`;

    // Verificar se URL já existe (evitar duplicação)
    const existing = await this.prisma.contentMedia.findUnique({
      where: { url: publicUrl }
    });

    if (existing) {
      // Se já existe, deletar o arquivo que acabamos de criar e retornar o existente
      try {
        await unlink(filePath);
      } catch (error) {
        this.logger.warn(`Erro ao deletar arquivo duplicado: ${filePath}`, error);
      }
      return { url: existing.url };
    }

    // Salvar no banco de dados
    const contentMedia = await this.prisma.contentMedia.create({
      data: {
        url: publicUrl,
        filePath: filePath
      }
    });

    this.logger.log(`Content media criado: ${contentMedia.id} - ${publicUrl}`);

    return { url: contentMedia.url };
  }

  /**
   * Extrai URLs de imagens do HTML
   */
  extractImageUrls(htmlContent: string): string[] {
    if (!htmlContent) {
      return [];
    }

    const regex = /<img[^>]+src=["']([^"']+)["']/gi;
    const urls: string[] = [];
    let match;

    while ((match = regex.exec(htmlContent)) !== null) {
      const url = match[1].trim();
      // Filtrar apenas URLs que são do nosso domínio (uploads/)
      if (url.includes('/uploads/')) {
        urls.push(url);
      }
    }

    return [...new Set(urls)]; // Remover duplicatas
  }

  /**
   * Cria ou atualiza referências de ContentMedia para uma notícia
   */
  async syncNewsContentMedia(newsId: number, htmlContent: string): Promise<void> {
    const imageUrls = this.extractImageUrls(htmlContent);

    // Buscar todas as referências atuais desta notícia
    const currentReferences = await this.prisma.newsContentMedia.findMany({
      where: { newsId },
      include: { contentMedia: true }
    });

    const currentUrls = currentReferences.map(ref => ref.contentMedia.url);
    const urlsToAdd = imageUrls.filter(url => !currentUrls.includes(url));
    const urlsToRemove = currentUrls.filter(url => !imageUrls.includes(url));

    // Adicionar novas referências
    for (const url of urlsToAdd) {
      let contentMedia = await this.prisma.contentMedia.findUnique({
        where: { url }
      });

      // Se não existe, criar (pode acontecer se a URL foi inserida manualmente)
      if (!contentMedia) {
        this.logger.warn(`ContentMedia não encontrado para URL: ${url}. Criando registro...`);
        // Extrair filePath da URL
        const urlPath = url.replace(/^https?:\/\/[^\/]+/, '');
        const filePath = urlPath.startsWith('/') ? urlPath.substring(1) : urlPath;

        contentMedia = await this.prisma.contentMedia.create({
          data: {
            url,
            filePath
          }
        });
      }

      // Criar referência
      await this.prisma.newsContentMedia.create({
        data: {
          newsId,
          contentMediaId: contentMedia.id
        }
      });
    }

    // Remover referências antigas
    for (const url of urlsToRemove) {
      const contentMedia = await this.prisma.contentMedia.findUnique({
        where: { url },
        include: { newsContentMedia: true }
      });

      if (contentMedia) {
        // Remover referência desta notícia
        await this.prisma.newsContentMedia.deleteMany({
          where: {
            newsId,
            contentMediaId: contentMedia.id
          }
        });

        // Verificar se ContentMedia ainda está em uso
        const remainingReferences = await this.prisma.newsContentMedia.count({
          where: { contentMediaId: contentMedia.id }
        });

        // Se não há mais referências, deletar arquivo e registro
        if (remainingReferences === 0) {
          await this.deleteContentMediaFile(contentMedia);
        }
      }
    }
  }

  /**
   * Deleta arquivo físico e registro de ContentMedia
   */
  async deleteContentMediaFile(contentMedia: any): Promise<void> {
    try {
      const filePath = contentMedia.filePath;
      const fileDir = path.dirname(filePath);

      // Deletar arquivo físico
      if (fs.existsSync(filePath)) {
        await unlink(filePath);
        this.logger.log(`Arquivo deletado: ${filePath}`);
      }

      // Verificar se a pasta está vazia e deletá-la se estiver
      await this.deleteEmptyDirectory(fileDir);

      // Deletar registro do banco
      await this.prisma.contentMedia.delete({
        where: { id: contentMedia.id }
      });

      this.logger.log(`ContentMedia deletado: ${contentMedia.id}`);
    } catch (error) {
      this.logger.error(`Erro ao deletar ContentMedia ${contentMedia.id}:`, error);
      // Não lançar exceção para não quebrar o fluxo
    }
  }

  /**
   * Deleta diretório se estiver vazio
   */
  private async deleteEmptyDirectory(dirPath: string): Promise<void> {
    try {
      // Não deletar o diretório base 'uploads'
      if (dirPath === this.baseUploadDir || !dirPath.startsWith(this.baseUploadDir)) {
        return;
      }

      // Verificar se o diretório existe
      if (!fs.existsSync(dirPath)) {
        return;
      }

      // Verificar se está vazio
      const files = await readdir(dirPath);
      
      if (files.length === 0) {
        // Pasta vazia, deletar
        try {
          // Tentar usar fs.rm primeiro (Node.js 14.14.0+)
          if ((fs as any).rm) {
            await promisify((fs as any).rm)(dirPath, { recursive: false });
          } else {
            // Fallback para fs.rmdir
            await promisify(fs.rmdir)(dirPath);
          }
          this.logger.log(`Pasta vazia deletada: ${dirPath}`);
          
          // Verificar se a pasta pai também está vazia (recursivo)
          const parentDir = path.dirname(dirPath);
          if (parentDir !== dirPath && parentDir.startsWith(this.baseUploadDir)) {
            await this.deleteEmptyDirectory(parentDir);
          }
        } catch (rmError: any) {
          // Se der erro (pasta não está vazia ou já foi deletada), apenas logar
          if (rmError.code !== 'ENOTEMPTY' && rmError.code !== 'ENOENT') {
            this.logger.warn(`Erro ao deletar pasta ${dirPath}:`, rmError.message);
          }
        }
      }
    } catch (error) {
      // Ignorar erros ao deletar pasta (pode não estar vazia ou já ter sido deletada)
      this.logger.debug(`Não foi possível deletar pasta ${dirPath}:`, error);
    }
  }

  /**
   * Deleta ContentMedia por URL
   */
  async deleteByUrl(url: string): Promise<void> {
    const contentMedia = await this.prisma.contentMedia.findUnique({
      where: { url },
      include: { newsContentMedia: true }
    });

    if (!contentMedia) {
      throw new NotFoundException('Imagem não encontrada');
    }

    // Verificar se está sendo usada por alguma notícia
    if (contentMedia.newsContentMedia.length > 0) {
      // Se está em uso, apenas remover referências (não deletar arquivo ainda)
      // Isso pode acontecer se a imagem foi removida do editor mas a notícia ainda não foi salva
      this.logger.warn(`Imagem ${url} está em uso por ${contentMedia.newsContentMedia.length} notícia(s). Removendo referências...`);
      
      // Remover todas as referências
      await this.prisma.newsContentMedia.deleteMany({
        where: { contentMediaId: contentMedia.id }
      });
    }

    // Deletar arquivo e registro
    await this.deleteContentMediaFile(contentMedia);
  }

  /**
   * Limpa ContentMedia órfãos (sem referências)
   */
  async cleanupOrphanedContentMedia(): Promise<number> {
    const orphanedMedia = await this.prisma.contentMedia.findMany({
      where: {
        newsContentMedia: {
          none: {}
        }
      }
    });

    let deletedCount = 0;
    for (const media of orphanedMedia) {
      await this.deleteContentMediaFile(media);
      deletedCount++;
    }

    this.logger.log(`Limpeza concluída: ${deletedCount} arquivos órfãos deletados`);
    return deletedCount;
  }

  /**
   * Converte imagem para WebP
   */
  private async convertToWebP(buffer: Buffer, outputPath: string): Promise<void> {
    await sharp(buffer)
      .webp({
        quality: 85,
        effort: 4 // Balance entre qualidade e velocidade (0-6)
      })
      .toFile(outputPath);
  }

  private async ensureUploadDirectoryExists(dir?: string): Promise<void> {
    const targetDir = dir || this.baseUploadDir;
    try {
      await mkdir(targetDir, { recursive: true });
    } catch (error: any) {
      if (error.code !== 'EEXIST') {
        throw error;
      }
    }
  }
}

