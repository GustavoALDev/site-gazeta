import { Component, input, OnInit } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Ads } from '@site-gazeta/models';

@Component({
  selector: 'lib-ads',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage],
  templateUrl: './ads.component.html',
  styleUrl: './ads.component.scss',
})
export class AdsComponent {
  announcements = input<Ads>();
}
