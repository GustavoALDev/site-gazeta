import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VideoService } from '../../../core/services/video.service';
import { CategoryService } from '../../../core/services/category.service';
import { Video, Category } from '@site-gazeta/models';
import { firstValueFrom } from 'rxjs';
import { Router } from '@angular/router';
import { VideoListFiltersComponent } from './video-list-filters/video-list-filters.component';

@Component({
  selector: 'app-video-list',
  standalone: true,
  imports: [CommonModule, VideoListFiltersComponent],
  templateUrl: './video-list.component.html',
  styleUrl: './video-list.component.scss',
})
export class VideoListComponent implements OnInit {
  private videoService = inject(VideoService);
  private categoryService = inject(CategoryService);
  private router = inject(Router);

  // Signals
  videos = signal<Video[]>([]);
  videoToDelete = signal<Video | null>(null);
  showDeleteConfirm = signal(false);
  playingVideoId = signal<number | null>(null);
  categories = signal<Category[]>([]);

  // Filtros
  filterDate = signal<string>('');
  filterOrder = signal<'desc' | 'asc' | null>(null);
  filterViews = signal<'asc' | 'desc' | ''>('');
  filterCategory = signal<number | null>(null);
  filterSearch = signal<string>('');
  filterFeatured = signal<boolean | null>(null);

  // Signal computado para vídeos filtrados
  filteredVideos = computed(() => {
    let filtered = this.videos();
    
    // Filtro por data de criação
    if (this.filterDate()) {
      filtered = filtered.filter(v => v.createdAt?.slice(0, 10) === this.filterDate());
    }
    
    // Filtro por categoria
    if (this.filterCategory()) {
      filtered = filtered.filter(v => 
        v.categories?.some(cat => cat.id === this.filterCategory())
      );
    }
    
    // Filtro por destaque
    if (this.filterFeatured() !== null) {
      filtered = filtered.filter(v => v.featured === this.filterFeatured());
    }
    
    // Filtro por pesquisa
    if (this.filterSearch()) {
      const search = this.filterSearch().toLowerCase();
      filtered = filtered.filter(v =>
        v.title.toLowerCase().includes(search) ||
        v.description?.toLowerCase().includes(search) ||
        v.tags?.some(tag => tag.toLowerCase().includes(search))
      );
    }
    
    // Ordenação por data (primeiro, se aplicável)
    if (this.filterOrder()) {
      filtered = [...filtered].sort((a, b) => {
        const dateA = new Date(a.createdAt || 0).getTime();
        const dateB = new Date(b.createdAt || 0).getTime();
        return this.filterOrder() === 'desc' ? dateB - dateA : dateA - dateB;
      });
    }
    
    // Filtro por visualizações (aplicado após ordenação por data)
    if (this.filterViews()) {
      filtered = [...filtered].sort((a, b) => {
        const viewsA = a.views || 0;
        const viewsB = b.views || 0;
        return this.filterViews() === 'asc' ? viewsA - viewsB : viewsB - viewsA;
      });
    }
    
    return filtered;
  });

  ngOnInit(): void {
    this.loadVideos();
    this.getCategories();
  }

  loadVideos(): void {
    firstValueFrom(this.videoService.getAll())
      .then((videos) => {
        this.videos.set(videos);
      })
      .catch((error) => {
        console.error('Erro ao carregar vídeos:', error);
      });
  }

  editVideo(video: Video): void {
    this.router.navigate(['/videos', video.id]);
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
        this.videos.update(videos => videos.filter(v => v.id !== video.id));
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

  getCategories(): void {
    firstValueFrom(this.categoryService.getAll())
      .then((categories) => {
        this.categories.set(categories);
      })
      .catch((error) => {
        console.error('Erro ao carregar categorias:', error);
      });
  }

  // Métodos para atualizar filtros
  setFilterDate(date: string): void {
    this.filterDate.set(date);
  }

  setFilterOrder(order: 'desc' | 'asc' | null): void {
    this.filterOrder.set(order);
  }

  setFilterViews(views: 'asc' | 'desc' | ''): void {
    this.filterViews.set(views);
  }

  setFilterCategory(categoryId: number | null): void {
    this.filterCategory.set(categoryId);
  }

  setFilterSearch(search: string): void {
    this.filterSearch.set(search);
  }

  setFilterFeatured(featured: boolean | null): void {
    this.filterFeatured.set(featured);
  }
}
