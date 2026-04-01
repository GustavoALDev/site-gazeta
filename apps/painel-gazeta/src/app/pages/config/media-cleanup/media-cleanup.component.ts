import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, computed, inject, signal } from '@angular/core';
import { AlertService } from '@site-gazeta/alert';
import { News, NewsMedia } from '@site-gazeta/models';
import { concatMap, first, from, Subject, takeUntil, toArray } from 'rxjs';
import { NewsService } from '../../../core/services/news.service';

interface DuplicateMediaGroup {
  fingerprint: string;
  label: string;
  keptMediaId: number;
  keptEmphasis: boolean;
  removedMediaIds: number[];
}

interface DuplicateNewsItem {
  newsId: number;
  title: string;
  subtitle: string;
  slug: string;
  mediaCount: number;
  duplicateGroups: DuplicateMediaGroup[];
  duplicateMediaCount: number;
}

@Component({
  selector: 'app-media-cleanup',
  imports: [CommonModule],
  templateUrl: './media-cleanup.component.html',
  styleUrl: './media-cleanup.component.scss',
})
export class MediaCleanupComponent implements OnInit, OnDestroy {
  private newsService = inject(NewsService);
  private alertService = inject(AlertService);
  private destroy$ = new Subject<void>();

  isLoading = signal<boolean>(false);
  isCleaning = signal<boolean>(false);
  hasScanned = signal<boolean>(false);
  duplicateNews = signal<DuplicateNewsItem[]>([]);
  lastScanAt = signal<string | null>(null);

  totalNewsScanned = signal<number>(0);

  duplicateNewsCount = computed(() => this.duplicateNews().length);
  duplicateGroupCount = computed(() =>
    this.duplicateNews().reduce((total, item) => total + item.duplicateGroups.length, 0)
  );
  duplicateMediaCount = computed(() =>
    this.duplicateNews().reduce((total, item) => total + item.duplicateMediaCount, 0)
  );

  ngOnInit(): void {
    this.scanForDuplicates();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  scanForDuplicates(): void {
    if (this.isLoading()) {
      return;
    }

    this.isLoading.set(true);
    this.newsService.getAll({ includeTrash: true })
      .pipe(takeUntil(this.destroy$), first())
      .subscribe({
        next: (newsList) => {
          const duplicateItems = this.findDuplicateNews(newsList as News[]);

          this.duplicateNews.set(duplicateItems);
          this.totalNewsScanned.set(newsList.length);
          this.lastScanAt.set(new Date().toISOString());
          this.hasScanned.set(true);
          this.isLoading.set(false);

          if (duplicateItems.length === 0) {
            this.alertService.info('Varredura concluída', 'Nenhuma notícia com mídias duplicadas foi encontrada.');
          } else {
            this.alertService.success(
              'Varredura concluída',
              `${duplicateItems.length} notícia(s) com duplicações encontrada(s).`
            );
          }
        },
        error: (error) => {
          this.isLoading.set(false);
          this.hasScanned.set(true);
          this.alertService.error('Erro', 'Não foi possível varrer as notícias para localizar duplicações.');
          console.error('Erro ao varrer notícias com mídias duplicadas:', error);
        }
      });
  }

  cleanAllDuplicates(): void {
    const items = [...this.duplicateNews()];

    if (items.length === 0 || this.isCleaning()) {
      return;
    }

    const confirmed = confirm(
      `Deseja limpar automaticamente as mídias duplicadas encontradas em ${items.length} notícia(s)? O sistema vai preservar a mídia destacada.`
    );

    if (!confirmed) {
      return;
    }

    this.isCleaning.set(true);

    from(items)
      .pipe(
        concatMap((item) => this.newsService.cleanupDuplicateMedia(item.newsId)),
        toArray(),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (results) => {
          const deletedCount = results.reduce((sum, result) => sum + result.deletedCount, 0);
          this.isCleaning.set(false);
          this.alertService.success(
            'Limpeza concluída',
            `${deletedCount} mídia(s) duplicada(s) removida(s) em ${results.length} notícia(s).`
          );
          this.scanForDuplicates();
        },
        error: (error) => {
          this.isCleaning.set(false);
          this.alertService.error('Erro', 'Falha ao executar a limpeza automática de mídias.');
          console.error('Erro na limpeza automática de mídias duplicadas:', error);
        }
      });
  }

  cleanSingleNews(newsId: number): void {
    if (this.isCleaning()) {
      return;
    }

    const item = this.duplicateNews().find((news) => news.newsId === newsId);
    if (!item) {
      return;
    }

    const confirmed = confirm(
      `Deseja limpar as mídias duplicadas da notícia "${item.title}"? A mídia destacada será preservada.`
    );

    if (!confirmed) {
      return;
    }

    this.isCleaning.set(true);

    this.newsService.cleanupDuplicateMedia(newsId)
      .pipe(takeUntil(this.destroy$), first())
      .subscribe({
        next: (result) => {
          this.isCleaning.set(false);
          this.alertService.success(
            'Limpeza concluída',
            `${result.deletedCount} mídia(s) duplicada(s) removida(s) em "${item.title}".`
          );
          this.scanForDuplicates();
        },
        error: (error) => {
          this.isCleaning.set(false);
          this.alertService.error('Erro', `Falha ao limpar as mídias duplicadas de "${item.title}".`);
          console.error(`Erro ao limpar mídias duplicadas da notícia ${newsId}:`, error);
        }
      });
  }

  hasResults(): boolean {
    return this.hasScanned() && !this.isLoading();
  }

  formatRemovedMediaIds(ids: number[]): string {
    return ids.map((id) => `#${id}`).join(', ');
  }

  private findDuplicateNews(newsList: News[]): DuplicateNewsItem[] {
    return newsList
      .map((news) => this.buildDuplicateNewsItem(news))
      .filter((item): item is DuplicateNewsItem => item !== null)
      .sort((a, b) => b.duplicateMediaCount - a.duplicateMediaCount || a.title.localeCompare(b.title));
  }

  private buildDuplicateNewsItem(news: News): DuplicateNewsItem | null {
    const mediaList = (news.mediaNews ?? []).filter((media): media is NewsMedia => !!media);

    if (mediaList.length <= 1) {
      return null;
    }

    const groups = new Map<string, NewsMedia[]>();

    mediaList.forEach((media) => {
      const fingerprint = this.getMediaFingerprint(media);
      const currentGroup = groups.get(fingerprint) ?? [];
      currentGroup.push(media);
      groups.set(fingerprint, currentGroup);
    });

    const duplicateGroups: DuplicateMediaGroup[] = [];
    let duplicateMediaCount = 0;

    groups.forEach((group, fingerprint) => {
      if (group.length <= 1) {
        return;
      }

      const keptMedia = group.find((media) => media.emphasis) ?? [...group].sort((a, b) => (b.id ?? 0) - (a.id ?? 0))[0];
      const removedMediaIds = group
        .filter((media) => media.id !== keptMedia.id)
        .map((media) => media.id)
        .filter((id): id is number => typeof id === 'number');

      duplicateMediaCount += removedMediaIds.length;
      duplicateGroups.push({
        fingerprint,
        label: this.getMediaLabel(group[0]),
        keptMediaId: keptMedia.id ?? 0,
        keptEmphasis: !!keptMedia.emphasis,
        removedMediaIds,
      });
    });

    if (duplicateGroups.length === 0) {
      return null;
    }

    return {
      newsId: news.id ?? 0,
      title: news.title ?? 'Sem título',
      subtitle: news.subtitle ?? '',
      slug: news.slug ?? '',
      mediaCount: mediaList.length,
      duplicateGroups,
      duplicateMediaCount,
    };
  }

  private getMediaFingerprint(media: NewsMedia): string {
    const source = this.getMediaSource(media);
    const filename = source.split('?')[0].split('/').pop() || '';

    return filename
      .replace(/_(medium|small|superSmall)(?=\.[^.]+$)/i, '')
      .replace(/^media_\d+_/, '')
      .replace(/^\d+_/, '')
      .toLowerCase();
  }

  private getMediaLabel(media: NewsMedia): string {
    const source = this.getMediaSource(media);
    return source.split('?')[0].split('/').pop() || `mídia ${media.id ?? ''}`.trim();
  }

  private getMediaSource(media: NewsMedia): string {
    const imgSize = media.imgSize as any;
    return imgSize?.original || imgSize?.medium || imgSize?.small || '';
  }
}
