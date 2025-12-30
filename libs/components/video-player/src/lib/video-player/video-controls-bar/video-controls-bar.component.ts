import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VideoVolumeControlComponent } from '../video-volume-control/video-volume-control.component';
import { VideoTimeDisplayComponent } from '../video-time-display/video-time-display.component';

@Component({
  selector: 'lib-video-controls-bar',
  standalone: true,
  imports: [CommonModule, VideoVolumeControlComponent, VideoTimeDisplayComponent],
  templateUrl: './video-controls-bar.component.html',
  styleUrl: './video-controls-bar.component.scss',
})
export class VideoControlsBarComponent {
  // Inputs
  isPlaying = input.required<boolean>();
  volume = input.required<number>();
  isMuted = input.required<boolean>();
  currentTimeFormatted = input.required<string>();
  durationFormatted = input.required<string>();
  playbackRate = input.required<number>();
  isFullscreen = input.required<boolean>();

  // Outputs
  playToggle = output<void>();
  volumeChange = output<number>();
  muteToggle = output<void>();
  playbackRateChange = output<number>();
  fullscreenToggle = output<void>();

  onPlayToggle(): void {
    this.playToggle.emit();
  }

  onVolumeChange(volume: number): void {
    this.volumeChange.emit(volume);
  }

  onMuteToggle(): void {
    this.muteToggle.emit();
  }

  onPlaybackRateToggle(): void {
    const current = this.playbackRate();
    const next = current === 1 ? 1.5 : current === 1.5 ? 2 : 0.75;
    this.playbackRateChange.emit(next);
  }

  onFullscreenToggle(): void {
    this.fullscreenToggle.emit();
  }
}

