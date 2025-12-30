import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Video } from '@site-gazeta/models';

@Component({
  selector: 'lib-video-modal-info',
  imports: [CommonModule],
  templateUrl: './video-modal-info.component.html',
  styleUrl: './video-modal-info.component.scss',
  standalone: true,
})
export class VideoModalInfoComponent {
  video = input.required<Video>();
}

