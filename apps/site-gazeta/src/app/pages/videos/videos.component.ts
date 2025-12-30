import { Component, ElementRef, ViewChild, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VideoCategoryGridComponent, VideoFeaturedComponent, VideoLatestComponent } from '@site-gazeta/video-components';
import { VideoModalComponent } from '@site-gazeta/video-player';
import { Video } from '@site-gazeta/models';
@Component({
  selector: 'app-videos',
  imports: [CommonModule, VideoCategoryGridComponent, VideoLatestComponent, VideoFeaturedComponent, VideoModalComponent],
  templateUrl: './videos.component.html',
  styleUrl: './videos.component.scss',
})
export class VideosComponent {

  @ViewChild('videoModal') videoModal!: VideoModalComponent;
  currentVideo = signal<Video>({} as Video);
  excludedVideoIds = signal<number[]>([]);

  receiveCurrentVideo(video: Video, videoModal: VideoModalComponent): void {
    this.currentVideo.set(video);
    videoModal.open();
  }

  onFeaturedVideosLoaded(videos: Video[]): void {
    const featuredIds = videos.map(v => v.id);
    this.updateExcludedIds(featuredIds);
  }

  onLatestVideosLoaded(ids: number[]): void {
    this.updateExcludedIds(ids);
  }

  private updateExcludedIds(newIds: number[]): void {
    const current = this.excludedVideoIds();
    const combined = [...new Set([...current, ...newIds])];
    this.excludedVideoIds.set(combined);
  }
}
