import { Component, inject, signal, OnInit, computed } from '@angular/core';

import { Category, HexColor } from '@site-gazeta/models';
import { CategoryFormComponent } from './category-form/category-form.component';
import { CategoryListComponent } from './category-list/category-list.component';
import { CategoryService } from '../../core/services/category.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-category',
  imports: [CategoryFormComponent, CategoryListComponent],
  templateUrl: './category.component.html',
  styleUrl: './category.component.scss',
})
export class CategoryComponent implements OnInit {
  categories = signal<Category[]>([]);
  editingCategory = signal<Category | null>(null);
  categoryService = inject(CategoryService);
  
  // Computed property to get all used colors
  usedColors = computed(() => {
    return this.categories()
      .map(category => category.color as HexColor)
      .filter((color, index, array) => array.indexOf(color) === index); // Remove duplicates
  });
  onCategorySubmit(categoryData: Category) {
    if (this.categories().find((c) => c.id === categoryData.id)) {
      this.categories.update((categories) =>
        categories.map((c) => (c.id === categoryData.id ? categoryData : c))
      );
    } else {
      this.categories.update((categories) => [...categories, categoryData]);
    }
  }

  ngOnInit(): void {
    this.categoryService.getAll().subscribe((categories) => {
      this.categories.set(categories as Category[]);
    });
  }

  onEditCategory(category: Category) {
    this.editingCategory.set(category);
  }

  onDeleteCategory(category: Category) {
    if (category.isActive === false) {
      return firstValueFrom(this.categoryService.delete(category.id as number))
        .then((res) => {
          alert('Categoria excluída com sucesso!');

          this.categories.update((categories) =>
            categories.filter((c) => c.id !== category.id)
          );
        })
        .catch((err) => {
          throw err;
        });
    }
    return alert('A categoria não pode ser excluída porque está ativa!');

  }

  onCancelEdit() {
    this.editingCategory.set(null);
  }
}
