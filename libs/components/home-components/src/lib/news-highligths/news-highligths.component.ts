import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiConfigService, HomeHighlightItem } from '@site-gazeta/api';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'lib-news-highligths',
  imports: [RouterModule, CommonModule],
  templateUrl: './news-highligths.component.html',
  styleUrl: './news-highligths.component.scss',
})
export class NewsHighligthsComponent {
  private apiService = inject(ApiConfigService);

  $news = toSignal(this.apiService.gethighlights(), { initialValue: [] as HomeHighlightItem[] });
}
