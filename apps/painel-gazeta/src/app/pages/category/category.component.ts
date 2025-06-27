import { Component, inject, signal, OnInit } from '@angular/core';

import { Category } from '@site-gazeta/models';
import { CategoryFormComponent } from './category-form/category-form.component';
import { CategoryListComponent } from './category-list/category-list.component';
import { ApiService } from '../../core/services/api.service';
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
  apiService = inject(ApiService);
  onCategorySubmit(categoryData: Category) {
    if (this.categories().find(c => c.id === categoryData.id)) {
      this.categories.update(categories => categories.map(c => c.id === categoryData.id ? categoryData : c));
    } else {
      this.categories.update(categories => [...categories, categoryData]);
    }
  }

  ngOnInit(): void {
    this.apiService.getCategories().subscribe((categories) => {
      this.categories.set(categories as Category[]);
    });
  }

  onEditCategory(category: Category) {
    this.editingCategory.set(category);
  }

  onDeleteCategory(category: Category) {
    firstValueFrom(this.apiService.deleteCategory(category.id as number)).then((res) => {
      console.log(res);
      this.categories.update(categories => categories.filter(c => c.id !== category.id));
    }).catch((err) => {
      console.error(err);
    });
    
    // Se estava editando a categoria que foi excluída, cancelar edição
    if (this.editingCategory()?.id === category.id) {
      this.editingCategory.set(null);
    }
  }

  onCancelEdit() {
    this.editingCategory.set(null);
  }
}
