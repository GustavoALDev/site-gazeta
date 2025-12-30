import { Component, input, output, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'lib-video-volume-control',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './video-volume-control.component.html',
  styleUrl: './video-volume-control.component.scss',
})
export class VideoVolumeControlComponent {
  // Inputs
  volume = input.required<number>(); // 0-1
  isMuted = input<boolean>(false);

  // Outputs
  volumeChange = output<number>(); // 0-1
  muteToggle = output<void>();

  // Computed
  volumePercentage = computed(() => this.volume() * 100);

  onVolumeChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = parseFloat(input.value) / 100;
    this.volumeChange.emit(Math.max(0, Math.min(1, value)));
  }

  onMuteClick(): void {
    this.muteToggle.emit();
  }
}

