import { Component, signal, computed, output, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Video } from '@site-gazeta/models';
import { ApiConfigService } from '@site-gazeta/api';
@Component({
  selector: 'lib-video-featured',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './video-featured.component.html',
  styleUrl: './video-featured.component.scss',
})
export class VideoFeaturedComponent implements OnInit{
  private apiConfigService = inject(ApiConfigService);
  currentVideo = output<Video>();
  videosLoaded = output<Video[]>();
  videos = signal<Video[]>([]);

  // Vídeo principal (primeiro do array)
  mainVideo = computed(() => {
    const videos = this.videos();
    return videos.length > 0 ? videos[0] : null;
  });

  // Vídeos secundários (restantes)
  secondaryVideos = computed(() => {
    const videos = this.videos();
    return videos.slice(1, 3); // Pega os próximos 2 vídeos
  });

  ngOnInit(): void {
    this.getVideosFeatured();
  }

  emitCurrentVideo(video: Video): void {
    this.currentVideo.emit(video);
  }

  getVideosFeatured() {
    this.apiConfigService.getVideosFeatured().subscribe({
      next: (videos) => {
        this.videos.set(videos);
        // Emite os vídeos carregados para o componente pai coletar os IDs
        this.videosLoaded.emit(videos);
      }
    });
  }
}
