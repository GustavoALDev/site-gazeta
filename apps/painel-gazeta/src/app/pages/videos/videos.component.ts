import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VideoUploadComponent } from './video-upload/video-upload.component';
import { VideoListComponent } from './video-list/video-list.component';
import { ApiService } from '../../core/services/api.service';
import { Video } from '@site-gazeta/models';

@Component({
  selector: 'app-videos',
  standalone: true,
  imports: [CommonModule, VideoUploadComponent, VideoListComponent],
  templateUrl: './videos.component.html',
  styleUrl: './videos.component.scss',
})
export class VideosComponent implements OnInit {
  private apiService = inject(ApiService);

  // Signals
  videos = signal<Video[]>([]);
  videoToEdit = signal<Video | null>(null);
  isLoading = signal(false);
  showUploadForm = signal(true);

  ngOnInit(): void {
    this.loadVideos();

  }

  loadVideos(): void {
    this.isLoading.set(true);
    this.apiService.getVideos().subscribe({
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
    this.videoToEdit.set(null);
  }

  handleEdit(video: Video): void {
    this.videoToEdit.set(video);
    this.showUploadForm.set(true);
    // Scroll suave para o formulário
    setTimeout(() => {
      const formElement = document.querySelector('.upload-form-section');
      formElement?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  }

  handleDelete(videoId: number): void {
    this.videos.update(videos => videos.filter(v => v.id !== videoId));
  }

  handleCancel(): void {
    this.videoToEdit.set(null);
  }

  toggleUploadForm(): void {
    this.showUploadForm.update(v => !v);
    if (!this.showUploadForm()) {
      this.videoToEdit.set(null);
    }
  }
}
