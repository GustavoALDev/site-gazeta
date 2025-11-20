import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoryConfigComponent } from './category-config/category-config.component';
import { OrderSectionComponent } from './order-section/order-section.component';

@Component({
  selector: 'app-home-config',
  imports: [CommonModule, CategoryConfigComponent, OrderSectionComponent],
  templateUrl: './home-config.component.html',
  styleUrl: './home-config.component.scss',
})
export class HomeConfigComponent {
  // Componente simplificado - cada sub-componente gerencia seu próprio salvamento
}
