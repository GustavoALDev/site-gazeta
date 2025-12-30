import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewsMedia } from '@site-gazeta/models';

@Component({
  selector: 'app-gallery',
  imports: [CommonModule],
  templateUrl: './gallery.component.html',
  styleUrl: './gallery.component.scss',
})
export class GalleryComponent {
  medias = input<NewsMedia[]>([]);
}
