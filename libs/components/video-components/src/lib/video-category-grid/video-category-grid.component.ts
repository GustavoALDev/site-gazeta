import { Component, input, output, computed, signal, inject, OnInit, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Video, Category } from '@site-gazeta/models';
import { VideoCarouselComponent } from './video-carousel/video-carousel.component';
import { ApiConfigService } from '@site-gazeta/api';

interface VideosByCategory {
  category: Category;
  videos: Video[];
}

@Component({
  selector: 'lib-video-category-grid',
  standalone: true,
  imports: [CommonModule, VideoCarouselComponent],
  templateUrl: './video-category-grid.component.html',
  styleUrl: './video-category-grid.component.scss',
})
export class VideoCategoryGridComponent implements OnInit {
  private apiConfigService = inject(ApiConfigService);
  excludeIds = input<number[]>([]);
  videos = signal<Video[]>([]);
  currentVideo = output<Video>();
  private initialized = false;

  // Agrupa vídeos por categoria, excluindo vídeos já exibidos
  videosByCategory = computed(() => {
    const videosList = this.videos();
    const excludeIdsSet = new Set(this.excludeIds());

    // Filtra vídeos excluídos
    const filteredVideos = videosList.filter(video => !excludeIdsSet.has(video.id));

    const grouped = new Map<number, VideosByCategory>();

    filteredVideos.forEach(video => {
      video.categories.forEach(category => {
        if (!grouped.has(category.id!)) {
          grouped.set(category.id!, {
            category,
            videos: []
          });
        }
        grouped.get(category.id!)!.videos.push(video);
      });
    });

    return Array.from(grouped.values());
  });

  constructor() {
    // Effect para recarregar vídeos quando excludeIds mudar (após inicialização)
    effect(() => {
      const excludeIds = this.excludeIds();
      // Só recarrega após a inicialização para evitar chamadas duplicadas
      if (this.initialized) {
        this.getVideos();
      }
    });
  }

  ngOnInit(): void {
    this.initialized = true;
    this.getVideos();
  }

  getVideos(): void {
    const excludeIds = this.excludeIds();
    this.apiConfigService.getVideosByCategory(excludeIds).subscribe({
      next: (videos) => {
        this.videos.set(videos);
      },
      error: (err) => {
        console.error('Erro ao carregar vídeos por categoria:', err);
      }
    });
  }
  onVideoSelected(video: Video): void {
    this.currentVideo.emit(video);
  }
}
