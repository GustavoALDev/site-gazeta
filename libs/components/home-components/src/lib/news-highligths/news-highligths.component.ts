import { Component, input, computed, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Category, News } from '@site-gazeta/models';
import { ApiConfigService } from '../config/api.config.service';
import { toSignal } from '@angular/core/rxjs-interop';



@Component({
  selector: 'lib-news-highligths',
  imports: [RouterModule, CommonModule],
  templateUrl: './news-highligths.component.html',
  styleUrl: './news-highligths.component.scss',
})
export class NewsHighligthsComponent implements OnInit{
  private apiService = inject(ApiConfigService);

  $news = toSignal(this.apiService.gethighlights())
  ngOnInit(): void {
    console.log('news highligths')
  }
  
}
