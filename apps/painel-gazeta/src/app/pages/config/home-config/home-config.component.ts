import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { CategoryConfigComponent, CategoryConfig } from './category-config/category-config.component';
import { OrderSectionComponent, HomeSection } from './order-section/order-section.component';

@Component({
  selector: 'app-home-config',
  imports: [CommonModule, ReactiveFormsModule, CategoryConfigComponent, OrderSectionComponent],
  templateUrl: './home-config.component.html',
  styleUrl: './home-config.component.scss',
})
export class HomeConfigComponent implements OnInit {
  @ViewChild(CategoryConfigComponent) categoryConfig!: CategoryConfigComponent;
  @ViewChild(OrderSectionComponent) orderSection!: OrderSectionComponent;

  // Dados da configuração
  categoryConfigData: CategoryConfig | null = null;
  sectionsData: HomeSection[] = [];

  ngOnInit() {
    // TODO: Carregar configuração salva da API
    this.loadHomeConfig();
  }

  loadHomeConfig() {
    // TODO: Implementar carregamento da configuração salva da API
    console.log('Carregando configuração da home...');
  }

  onCategoryConfigChange(config: CategoryConfig) {
    this.categoryConfigData = config;
    console.log('Category config changed:', config);
  }

  onSectionsChange(sections: HomeSection[]) {
    this.sectionsData = sections;
    console.log('Sections changed:', sections);
  }

  onSubmit() {
    // Validar categorias
    if (!this.categoryConfig.isValid()) {
      alert('Selecione exatamente 3 categorias para cada seção (Destaques e Top Gazeta) ou ative o modo aleatório');
      return;
    }

    console.log('Configuração da home:', {
      categories: this.categoryConfigData,
      sections: this.sectionsData
    });

    // TODO: Implementar chamada da API para salvar
    alert('Configurações da home salvas com sucesso!');
  }

  onReset() {
    this.categoryConfig.reset();
    this.orderSection.reset();
    console.log('Formulário resetado');
  }
}
