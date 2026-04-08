import { Component, signal, computed, output, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Video } from '@site-gazeta/models';
import { ApiConfigService } from '@site-gazeta/api';

@Component({
  selector: 'lib-video-latest',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './video-latest.component.html',
  styleUrl: './video-latest.component.scss',
})
export class VideoLatestComponent implements OnInit {
  private apiConfigService = inject(ApiConfigService);
  currentVideo = output<Video>();
  excludedVideoIds = output<number[]>();
  videos = signal<Video[]>([]);



  firstRow = computed(() => {
    return this.videos().slice(0, 3);
  });

  secondRow = computed(() => {
    return this.videos().slice(3, 6);
  });

  ngOnInit(): void {
    this.getVideos();
  }

  getVideos(): void {
    this.apiConfigService.getVideosLatest().subscribe({
      next: (videos) => {
        this.videos.set(videos);
        // Emite os IDs dos vídeos exibidos para evitar duplicação
        const ids = videos.map(v => v.id);
        this.excludedVideoIds.emit(ids);
      },
      error: (err) => {
        console.error('Erro ao carregar vídeos:', err);
      }
    });
  }

  onVideoClick(video: Video): void {
    this.currentVideo.emit(video);
  }

  playVideo(video: Video, event: Event): void {
    event.stopPropagation();
    this.currentVideo.emit(video);
  }
}
