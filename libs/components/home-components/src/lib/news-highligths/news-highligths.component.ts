import { Component, Signal, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { News } from '@site-gazeta/models';
import { ApiConfigService, HomeHighlightItem } from 'libs/api/service/api-config.service';
import { toSignal } from '@angular/core/rxjs-interop';



@Component({
  selector: 'lib-news-highligths',
  imports: [RouterModule, CommonModule],
  templateUrl: './news-highligths.component.html',
  styleUrl: './news-highligths.component.scss',
})
export class NewsHighligthsComponent implements OnInit{
  private apiService = inject(ApiConfigService);

  $news: Signal<HomeHighlightItem[]> = toSignal(this.apiService.gethighlights(), { initialValue: [] as HomeHighlightItem[] })
  ngOnInit(): void {
    console.log('news highligths')
  }

}
