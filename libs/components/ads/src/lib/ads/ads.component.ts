import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Ads } from '@site-gazeta/models';

@Component({
  selector: 'lib-ads',
  imports: [CommonModule],
  templateUrl: './ads.component.html',
  styleUrl: './ads.component.scss',
})
export class AdsComponent {
  announcements = input<Ads>();
  size = input<string>('728x90');
}
