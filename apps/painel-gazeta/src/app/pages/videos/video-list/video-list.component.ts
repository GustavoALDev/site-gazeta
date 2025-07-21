import {
  Component,
  computed,
  effect,
  inject,
  input,
  OnInit,
  output,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../core/services/api.service';
import { firstValueFrom } from 'rxjs';
import { RouterModule } from '@angular/router';
import { YoutubeVideo } from '@site-gazeta/models';
import { YouTubePlayer } from '@angular/youtube-player';

@Component({
  selector: 'app-video-list',
  standalone: true,
  imports: [CommonModule, RouterModule, YouTubePlayer],
  templateUrl: './video-list.component.html',
  styleUrl: './video-list.component.scss',
})
export class VideoListComponent implements OnInit {
  private apiService = inject(ApiService);
  videos = signal<YoutubeVideo[]>([]);
  videoEmitter = output<YoutubeVideo>();
  updateList = input();
  filterDate = signal<string>('');
  filterOrder = signal<'desc' | 'asc'>('desc');
  filterSearch = signal<string>('');

  filteredVideos = computed(() => {
    let filtered = this.videos();

    if (this.filterDate()) {
      filtered = filtered.filter(
        (v) => v.publishedAt?.slice(0, 10) === this.filterDate()
      );
    }

    if (this.filterSearch()) {
      const search = this.filterSearch().toLowerCase();
      filtered = filtered.filter(
        (v) =>
          v.title.toLowerCase().includes(search) ||
          v.description?.toLowerCase().includes(search)
      );
    }

    return filtered.sort((a, b) => {
      const dateA = new Date(a.publishedAt).getTime();
      const dateB = new Date(b.publishedAt).getTime();
      return this.filterOrder() === 'desc' ? dateB - dateA : dateA - dateB;
    });
  });
  constructor() {
    effect(() => {
      this.updateList();
      this.getVideos();
      console.log('Update list called');
    });
  }
  ngOnInit(): void {
    this.getVideos();
  }

  getVideos() {
    this.apiService.getVideos().subscribe({
      next: (videos) => {
        this.videos.set(videos);
      },
      error: (error) => {
        throw error;
      },
    });
  }

  editVideo(video: YoutubeVideo) {
    this.videoEmitter.emit(video);
  }

  deleteVideo(videoId: number, isActive: boolean) {
    if (!isActive) {
      const conf = confirm('Tem certeza que deseja apagar o vídeo?');
      if (conf) {
        firstValueFrom(this.apiService.deleteVideo(videoId))
          .then((success) => {
            alert(success.message);
            this.getVideos();
          })
          .catch((error) => {
            throw error;
          });
      }
    } else {
      alert(
        'Vídeo Ativo, não é possível apagar. desative o vídeo antes de apagar.'
      );
    }
  }

  setFilterDate(date: string) {
    this.filterDate.set(date);
  }
  setFilterOrder(order: 'desc' | 'asc') {
    this.filterOrder.set(order);
  }
  setFilterSearch(search: string) {
    this.filterSearch.set(search);
  }
}
