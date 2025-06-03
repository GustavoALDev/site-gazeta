import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TextEditorComponent } from '@site-gazeta/text-editor';

@Component({
  selector: 'app-news',
  imports: [CommonModule, TextEditorComponent],
  templateUrl: './news.component.html',
  styleUrl: './news.component.scss',
})
export class NewsComponent {}
