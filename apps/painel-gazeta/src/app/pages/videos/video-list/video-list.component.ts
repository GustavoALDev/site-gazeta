import { Component, inject, signal, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VideoService } from '../../../core/services/video.service';
import { Video } from '@site-gazeta/models';

@Component({
  selector: 'app-video-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './video-list.component.html',
  styleUrl: './video-list.component.scss',
})
export class VideoListComponent {
  private videoService = inject(VideoService);

  // Inputs & Outputs
  videos = input.required<Video[]>();
  onEdit = output<Video>();
  onDelete = output<number>();

  // Signals
  videoToDelete = signal<Video | null>(null);
  showDeleteConfirm = signal(false);
  playingVideoId = signal<number | null>(null);

  editVideo(video: Video): void {
    this.onEdit.emit(video);
  }

  confirmDelete(video: Video): void {
    this.videoToDelete.set(video);
    this.showDeleteConfirm.set(true);
  }

  cancelDelete(): void {
    this.videoToDelete.set(null);
    this.showDeleteConfirm.set(false);
  }

  deleteVideo(): void {
    const video = this.videoToDelete();
    if (!video?.id) return;

    this.videoService.delete(video.id).subscribe({
      next: () => {
        this.onDelete.emit(video.id);
        this.cancelDelete();
      },
      error: (err) => {
        console.error('Erro ao deletar vídeo:', err);
        this.cancelDelete();
      }
    });
  }

  togglePlayVideo(videoId: number): void {
    if (this.playingVideoId() === videoId) {
      this.playingVideoId.set(null);
    } else {
      this.playingVideoId.set(videoId);
    }
  }

  isPlaying(videoId: number): boolean {
    return this.playingVideoId() === videoId;
  }

  formatDuration(duration: string): string {
    // Se já estiver formatado (HH:MM:SS ou MM:SS), retorna como está
    if (duration.includes(':')) {
      return duration;
    }
    
    // Se for em segundos, converte para MM:SS
    const totalSeconds = parseInt(duration);
    if (isNaN(totalSeconds)) return duration;
    
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }
}
