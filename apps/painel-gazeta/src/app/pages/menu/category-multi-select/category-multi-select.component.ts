import { Component, inject, signal, input, output, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoryService } from '../../../core/services/category.service';
import { Category } from '@site-gazeta/models';

@Component({
  selector: 'app-category-multi-select',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './category-multi-select.component.html',
  styleUrl: './category-multi-select.component.scss',
})
export class CategoryMultiSelectComponent {
  private categoryService = inject(CategoryService);

  // Inputs & Outputs
  selectedCategories = input<Category[]>([]);
  onCategoriesChange = output<Category[]>();

  // Signals
  allCategories = signal<Category[]>([]);
  searchTerm = signal<string>('');
  dropdownOpen = signal<boolean>(false);

  // Computed
  filteredCategories = computed(() => {
    const term = this.searchTerm().toLowerCase().trim();
    const all = this.allCategories();

    if (!term) {
      return all;
    }

    return all.filter(c => 
      c.name.toLowerCase().includes(term) || 
      c.description?.toLowerCase().includes(term) ||
      c.slug?.toLowerCase().includes(term)
    );
  });

  isCategorySelected(category: Category): boolean {
    return this.selectedCategories().some(c => c.id === category.id);
  }

  constructor() {
    this.loadCategories();
  }


  private loadCategories(): void {
    this.categoryService.getActive().subscribe({
      next: (categories) => this.allCategories.set(categories),
      error: (err) => console.error('Erro ao carregar categorias:', err)
    });
  }

  toggleDropdown(event?: Event): void {
    // Não usar stopPropagation aqui para permitir que o document listener funcione
    this.dropdownOpen.update(v => !v);
    if (!this.dropdownOpen()) {
      this.searchTerm.set('');
    }
  }

  onSearchChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchTerm.set(input.value);
  }

  selectCategory(category: Category): void {
    const current = [...this.selectedCategories()];
    const index = current.findIndex(c => c.id === category.id);
    
    if (index >= 0) {
      // Remover se já estiver selecionada
      current.splice(index, 1);
    } else {
      // Adicionar se não estiver selecionada
      current.push(category);
    }
    
    this.onCategoriesChange.emit(current);
  }

  removeCategory(category: Category): void {
    const current = this.selectedCategories().filter(c => c.id !== category.id);
    this.onCategoriesChange.emit(current);
  }

  closeDropdown(): void {
    this.dropdownOpen.set(false);
    this.searchTerm.set('');
  }
}

