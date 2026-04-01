import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, effect, input, output, signal } from '@angular/core';
import { NewsMedia } from '@site-gazeta/models';

@Component({
  selector: 'lib-gallery',
  imports: [CommonModule],
  templateUrl: './gallery.component.html',
  styleUrl: './gallery.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GalleryComponent {
  readonly mediaItems = input<NewsMedia[]>([]);
  readonly itemsPerView = input<number>(3);

  readonly mediaSelected = output<NewsMedia>();

  protected readonly currentIndex = signal(0);
  protected readonly pageSize = computed(() => Math.max(1, this.itemsPerView()));
  protected readonly totalItems = computed(() => this.mediaItems().length);

  protected readonly visibleItems = computed(() => {
    const items = this.mediaItems();
    const start = this.currentIndex();
    const end = start + this.pageSize();

    return items.slice(start, end);
  });

  protected readonly canGoPrevious = computed(() => this.currentIndex() > 0);
  protected readonly canGoNext = computed(() => this.currentIndex() + this.pageSize() < this.totalItems());

  protected readonly pageCounterLabel = computed(() => {
    const total = this.totalItems();

    if (total === 0) {
      return '0 / 0';
    }

    return `${Math.floor(this.currentIndex() / this.pageSize()) + 1} / ${Math.ceil(total / this.pageSize())}`;
  });

  constructor() {
    effect(() => {
      const total = this.totalItems();
      const pageSize = this.pageSize();

      if (total === 0) {
        if (this.currentIndex() !== 0) {
          this.currentIndex.set(0);
        }
        return;
      }

      const maxStart = Math.floor((total - 1) / pageSize) * pageSize;

      if (this.currentIndex() > maxStart) {
        this.currentIndex.set(maxStart);
      }
    }, { allowSignalWrites: true });
  }

  protected goToPrevious(): void {
    if (!this.canGoPrevious()) {
      return;
    }

    this.currentIndex.set(Math.max(0, this.currentIndex() - this.pageSize()));
  }

  protected goToNext(): void {
    if (!this.canGoNext()) {
      return;
    }

    this.currentIndex.set(this.currentIndex() + this.pageSize());
  }

  protected selectMedia(media: NewsMedia): void {
    this.mediaSelected.emit(media);
  }

  protected getPreviewSource(media: NewsMedia): string {
    return media.imgSize?.medium || media.imgSize?.original || media.imgSize?.small || '';
  }

  protected getFullSource(media: NewsMedia): string {
    return media.imgSize?.original || media.imgSize?.medium || media.imgSize?.small || '';
  }
}
