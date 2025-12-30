import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoryConfigComponent } from './category-config/category-config.component';
import { CarouselConfigComponent } from './carousel-config/carousel-config.component';

@Component({
  selector: 'app-home-config',
  imports: [CommonModule, CategoryConfigComponent, CarouselConfigComponent],
  templateUrl: './home-config.component.html',
  styleUrl: './home-config.component.scss',
})
export class HomeConfigComponent {
  // Componente simplificado - cada sub-componente gerencia seu próprio salvamento
}
