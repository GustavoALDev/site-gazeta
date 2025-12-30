import { Component, input, output, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'lib-video-progress-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './video-progress-bar.component.html',
  styleUrl: './video-progress-bar.component.scss',
})
export class VideoProgressBarComponent {
  // Inputs
  progress = input.required<number>(); // 0-100
  buffered = input<number>(0); // 0-100
  duration = input<number>(0);
  formatTimeFn = input.required<(seconds: number) => string>();

  // Outputs
  seek = output<number>(); // percentage 0-100
  hoverPositionChange = output<number>(); // percentage 0-100
  hoverTimeChange = output<number>(); // time in seconds

  // Internal state
  isHovering = signal<boolean>(false);
  hoverPosition = signal<number>(0);
  hoverTime = signal<number>(0);

  // Computed
  formattedHoverTime = computed(() => {
    const time = this.hoverTime();
    return this.formatTimeFn()(time);
  });

  onProgressBarClick(event: MouseEvent): void {
    const progressBar = event.currentTarget as HTMLElement;
    const rect = progressBar.getBoundingClientRect();
    const percentage = Math.max(0, Math.min(100, ((event.clientX - rect.left) / rect.width) * 100));
    this.seek.emit(percentage);
  }

  onProgressBarHover(event: MouseEvent): void {
    const progressBar = event.currentTarget as HTMLElement;
    const rect = progressBar.getBoundingClientRect();
    const percentage = Math.max(0, Math.min(100, ((event.clientX - rect.left) / rect.width) * 100));
    const duration = this.duration();
    
    this.isHovering.set(true);
    this.hoverPosition.set(percentage);
    this.hoverPositionChange.emit(percentage);
    
    if (duration) {
      const time = (percentage / 100) * duration;
      this.hoverTime.set(time);
      this.hoverTimeChange.emit(time);
    }
  }

  onProgressBarLeave(): void {
    this.isHovering.set(false);
  }
}

