import { Component, input, output, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Video } from '@site-gazeta/models';

@Component({
  selector: 'lib-video-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './video-list.component.html',
  styleUrl: './video-list.component.scss',
})
export class VideoListComponent {
  videos = input<Video[]>([]);
  currentVideoId = input<number | null>(null);
  onVideoClick = output<Video>();

  private imageErrors = new Set<number>();

  constructor(private cdr: ChangeDetectorRef) {}

  isActiveVideo(videoId: number): boolean {
    return this.currentVideoId() === videoId;
  }

  shouldShowPlaceholder(video: Video): boolean {
    // Só mostra placeholder se não tiver thumbnail, não tiver URL do vídeo, ou a imagem falhou
    return (!video.thumbnail || this.imageErrors.has(video.id)) && !video.url;
  }

  shouldShowImage(video: Video): boolean {
    return !!video.thumbnail && !this.imageErrors.has(video.id);
  }

  shouldShowVideoThumbnail(video: Video): boolean {
    // Mostra o vídeo quando não tem thumbnail ou a imagem falhou, mas tem URL do vídeo
    return (!video.thumbnail || this.imageErrors.has(video.id)) && !!video.url;
  }

  onImageError(video: Video): void {
    this.imageErrors.add(video.id);
    this.cdr.detectChanges();
  }

  handleVideoClick(event: MouseEvent, video: Video): void {
    event.preventDefault();
    event.stopPropagation();
    this.onVideoClick.emit(video);
  }
}
