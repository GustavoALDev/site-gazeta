import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditorComponent } from '@site-gazeta/editor';

@Component({
  selector: 'app-news',
  imports: [CommonModule, EditorComponent],
  templateUrl: './news.component.html',
  styleUrl: './news.component.scss',
})
export class NewsComponent {}
