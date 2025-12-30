import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VideoUploadComponent } from './video-upload/video-upload.component';
import { VideoService } from '../../core/services/video.service';
import { Video } from '@site-gazeta/models';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-videos',
  standalone: true,
  imports: [CommonModule, VideoUploadComponent, RouterModule],
  templateUrl: './videos.component.html',
  styleUrl: './videos.component.scss',
})
export class VideosComponent implements OnInit {
  private videoService = inject(VideoService);
  private activeRoute = inject(ActivatedRoute);
  private router = inject(Router);

  // Signals
  videoToEdit = signal<Video | null>(null);
  isEdit = computed(() => !!this.videoToEdit());
  videoId: number | null = null;

  ngOnInit(): void {
    this.checkEdit();
  }

  async checkEdit() {
    return firstValueFrom(this.activeRoute.params)
      .then((param) => {
        const videoId = param['id'];
        if (videoId) {
          this.videoId = Number(videoId);
          
          firstValueFrom(this.videoService.getById(this.videoId))
            .then((video) => {
              this.videoToEdit.set(video);
            })
            .catch((error) => {
              console.error('Erro ao carregar vídeo:', error);
              this.router.navigate(['/videosList']);
            });
        }
      })
      .catch((error) => {
        console.error('Erro ao verificar parâmetros:', error);
      });
  }

  handleSave(video: Video): void {
    this.router.navigate(['/videosList']);
  }

  handleCancel(): void {
    this.router.navigate(['/videosList']);
  }
}
