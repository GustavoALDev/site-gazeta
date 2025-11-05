import { Component, input, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewsVideo } from '@site-gazeta/models';
import { Video } from '@site-gazeta/models';

@Component({
  selector: 'lib-video-player',
  imports: [CommonModule],
  templateUrl: './video-player.component.html',
  styleUrl: './video-player.component.scss',
})
export class VideoPlayerComponent {
  // Input de vídeos
  videos = input.required<Video[]>();
  
  // Título da seção
  title = input<string>('Vídeos em alta hoje');

  // Signal para rastrear o vídeo atual
  currentVideoIndex = signal<number>(0);

  // Computed para o vídeo atual
  currentVideo = computed(() => {
    const videos = this.videos();
    const index = this.currentVideoIndex();
    return videos[index] || null;
  });

  log(log:any){
    console.log(log)
  };
  
  // Método para trocar de vídeo
  selectVideo(index: number): void {
    this.currentVideoIndex.set(index);
  }

  // Verificar se é o vídeo atual
  isCurrentVideo(index: number): boolean {
    return this.currentVideoIndex() === index;
  }

  // Formatar tempo em MM:SS
  formatTime(seconds: number): string {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  // Buscar posição no vídeo
  seekVideo(event: MouseEvent, video: HTMLVideoElement): void {
    const progressBar = event.currentTarget as HTMLElement;
    const rect = progressBar.getBoundingClientRect();
    const pos = (event.clientX - rect.left) / rect.width;
    video.currentTime = pos * video.duration;
  }

  // Toggle fullscreen
  toggleFullscreen(video: HTMLVideoElement): void {
    if (!document.fullscreenElement) {
      video.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }

  // Avançar vídeo
  skipForward(video: HTMLVideoElement): void {
    video.currentTime = Math.min(video.duration, video.currentTime + 5);
  }

  // Retroceder vídeo
  skipBackward(video: HTMLVideoElement): void {
    video.currentTime = Math.max(0, video.currentTime - 5);
  }
}
