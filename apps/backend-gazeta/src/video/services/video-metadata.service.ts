import { Injectable, Logger } from '@nestjs/common';
import ffmpeg from 'fluent-ffmpeg';
import ffprobe from '@ffprobe-installer/ffprobe';

ffmpeg.setFfprobePath(ffprobe.path);

@Injectable()
export class VideoMetadataService {
  private readonly logger = new Logger(VideoMetadataService.name);

  async getDurationSeconds(filePath: string): Promise<number> {
    return new Promise((resolve, reject) => {
      ffmpeg.ffprobe(filePath, (err, data) => {
        if (err) {
          this.logger.error(`ffprobe error for ${filePath}: ${err.message}`);
          return reject(err);
        }
        const sec = Number(data?.format?.duration ?? 0);
        resolve(Number.isFinite(sec) ? sec : 0);
      });
    });
  }

  formatDuration(totalSeconds: number): string {
    const total = Math.max(0, Math.floor(totalSeconds));
    const hours = Math.floor(total / 3600);
    const mins = Math.floor((total % 3600) / 60);
    const secs = total % 60;
    const two = (n: number) => String(n).padStart(2, '0');
    return hours > 0 ? `${two(hours)}:${two(mins)}:${two(secs)}` : `${two(mins)}:${two(secs)}`;
  }

  async getDurationString(filePath: string): Promise<string> {
    const seconds = await this.getDurationSeconds(filePath);
    return this.formatDuration(seconds);
  }
}


