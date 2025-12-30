import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'lib-video-time-display',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './video-time-display.component.html',
  styleUrl: './video-time-display.component.scss',
})
export class VideoTimeDisplayComponent {
  // Inputs
  currentTime = input.required<string>();
  duration = input.required<string>();
}

