import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VideoUploadComponent } from './video-upload/video-upload.component';
import { VideoListComponent } from './video-list/video-list.component';
import { VideoService } from '../../core/services/video.service';
import { Video } from '@site-gazeta/models';

interface VideosComponentState {
  activeTab: 'upload' | 'list';
  videoToEdit: Video | null;
}

@Component({
  selector: 'app-videos',
  standalone: true,
  imports: [CommonModule, VideoUploadComponent, VideoListComponent],
  templateUrl: './videos.component.html',
  styleUrl: './videos.component.scss',
})
export class VideosComponent implements OnInit {
  private videoService = inject(VideoService);

  // Estado do componente usando signals
  state = signal<VideosComponentState>({
    activeTab: 'list',
    videoToEdit: null,
  });

  // Signals para dados
  videos = signal<Video[]>([]);
  isLoading = signal(false);

  // Computed signals
  isEdit = computed(() => !!this.state().videoToEdit);

  ngOnInit(): void {
    this.loadVideos();
  }

  setActiveTab(tab: 'upload' | 'list'): void {
    this.state.update(state => ({ 
      ...state, 
      activeTab: tab,
      // Limpa o modo de edição ao trocar para lista OU ao clicar novamente em upload (reset)
      videoToEdit: null
    }));
  }

  loadVideos(): void {
    this.isLoading.set(true);
    this.videoService.getAll().subscribe({
      next: (videos) => {
        this.videos.set(videos);
        console.log('videos', this.videos());
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Erro ao carregar vídeos:', err);
        this.isLoading.set(false);
      }
    });
  }

  handleSave(video: Video): void {
    this.loadVideos();
    this.state.update(state => ({
      ...state,
      activeTab: 'list',
      videoToEdit: null,
    }));
  }

  handleEdit(video: Video): void {
    this.state.update(state => ({
      ...state,
      activeTab: 'upload',
      videoToEdit: video,
    }));
  }

  handleDelete(videoId: number): void {
    this.videos.update(videos => videos.filter(v => v.id !== videoId));
  }

  handleCancel(): void {
    this.state.update(state => ({
      ...state,
      activeTab: 'list',
      videoToEdit: null,
    }));
  }
}
