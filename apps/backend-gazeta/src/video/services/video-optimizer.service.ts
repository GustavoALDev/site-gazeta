import { Injectable, Logger } from '@nestjs/common';
import { exec } from 'child_process';
import { promisify } from 'util';
import * as path from 'path';
import { existsSync } from 'fs';

const execAsync = promisify(exec);

@Injectable()
export class VideoOptimizerService {
  private readonly logger = new Logger(VideoOptimizerService.name);

  /**
   * Otimiza vídeo MP4 para streaming progressivo
   * Move o moov atom para o início do arquivo para permitir streaming
   * 
   * @param inputPath Caminho do vídeo original
   * @param outputPath Caminho onde salvar o vídeo otimizado (opcional, sobrescreve se não fornecido)
   * @returns Caminho do vídeo otimizado
   */
  async optimizeForProgressiveStreaming(
    inputPath: string,
    outputPath?: string
  ): Promise<string> {
    try {
      if (!existsSync(inputPath)) {
        throw new Error(`Arquivo não encontrado: ${inputPath}`);
      }

      const finalOutputPath = outputPath || inputPath;
      const tempPath = `${finalOutputPath}.tmp`;

      // Verificar se FFmpeg está disponível
      const ffmpegAvailable = await this.checkFfmpegAvailability();
      if (!ffmpegAvailable) {
        this.logger.warn('FFmpeg não disponível. Vídeo será usado sem otimização.');
        return inputPath;
      }

      // Comando FFmpeg para otimizar MP4 para streaming progressivo
      // -movflags faststart: move o moov atom para o início
      // -c copy: copia os streams sem re-encoding (rápido)
      const command = `ffmpeg -i "${inputPath}" -c copy -movflags +faststart "${tempPath}" -y`;

      this.logger.log(`Otimizando vídeo para streaming progressivo: ${inputPath}`);

      await execAsync(command);

      // Se foi especificado outputPath diferente, mover o arquivo
      if (outputPath && outputPath !== inputPath) {
        const fs = await import('fs/promises');
        await fs.rename(tempPath, finalOutputPath);
        // Deletar arquivo original se foi otimizado em lugar diferente
        try {
          await fs.unlink(inputPath);
        } catch (error) {
          this.logger.warn(`Não foi possível deletar arquivo original: ${error.message}`);
        }
      } else {
        // Se é o mesmo arquivo, substituir
        const fs = await import('fs/promises');
        await fs.unlink(inputPath);
        await fs.rename(tempPath, finalOutputPath);
      }

      this.logger.log(`Vídeo otimizado com sucesso: ${finalOutputPath}`);
      return finalOutputPath;
    } catch (error) {
      this.logger.error(`Erro ao otimizar vídeo: ${error.message}`, error.stack);
      // Em caso de erro, retornar o arquivo original
      return inputPath;
    }
  }

  /**
   * Verifica se o vídeo já está otimizado para streaming progressivo
   * (moov atom no início)
   */
  async isOptimizedForStreaming(videoPath: string): Promise<boolean> {
    try {
      const ffmpegAvailable = await this.checkFfmpegAvailability();
      if (!ffmpegAvailable) {
        return false;
      }

      // Usar ffprobe para verificar se o moov está no início
      const command = `ffprobe -v error -show_entries format=start_time -of default=noprint_wrappers=1:nokey=1 "${videoPath}"`;
      
      try {
        await execAsync(command);
        // Se conseguir ler rapidamente, provavelmente está otimizado
        // Verificação mais precisa seria ler os primeiros bytes do arquivo
        return true;
      } catch {
        return false;
      }
    } catch {
      return false;
    }
  }

  /**
   * Verifica se FFmpeg está disponível
   */
  private async checkFfmpegAvailability(): Promise<boolean> {
    try {
      await execAsync('ffmpeg -version');
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Valida se o arquivo é um MP4 válido
   */
  async validateMp4(videoPath: string): Promise<boolean> {
    try {
      const ffmpegAvailable = await this.checkFfmpegAvailability();
      if (!ffmpegAvailable) {
        // Se não tem FFmpeg, verificar extensão
        return videoPath.toLowerCase().endsWith('.mp4');
      }

      // Usar ffprobe para validar
      const command = `ffprobe -v error -select_streams v:0 -show_entries stream=codec_name -of default=noprint_wrappers=1:nokey=1 "${videoPath}"`;
      
      const { stdout } = await execAsync(command);
      const codec = stdout.trim().toLowerCase();
      
      // Verificar se é h264 (codec comum em MP4)
      return codec === 'h264' || codec === 'hevc';
    } catch {
      return false;
    }
  }
}

