import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Category } from '@site-gazeta/models';
import { CategoryFormComponent } from './category-form/category-form.component';
import { CategoryListComponent } from './category-list/category-list.component';

@Component({
  selector: 'app-category',
  imports: [CommonModule, CategoryFormComponent, CategoryListComponent],
  templateUrl: './category.component.html',
  styleUrl: './category.component.scss',
})
export class CategoryComponent {
  categories = signal<Category[]>([]);
  editingCategory = signal<Category | null>(null);

  onCategorySubmit(categoryData: Category) {
    if (categoryData.id) {
      // Atualizar categoria existente
      const updatedCategory: Category = {
        ...categoryData,
        updatedAt: new Date().toISOString()
      };
      this.categories.update(categories => 
        categories.map(cat => cat.id === categoryData.id ? updatedCategory : cat)
      );
      this.editingCategory.set(null);
    } else {
      // Criar nova categoria
      const newCategory: Category = {
        id: this.categories().length + 1,
        name: categoryData.name,
        description: categoryData.description,
        slug: categoryData.slug,
        isActive: categoryData.isActive,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      console.log('newCategory', newCategory);
      this.categories.update(categories => [...categories, newCategory]);
    }
  }

  onEditCategory(category: Category) {
    this.editingCategory.set(category);
  }

  onDeleteCategory(category: Category) {
    this.categories.update(categories => categories.filter(c => c.id !== category.id));
    
    // Se estava editando a categoria que foi excluída, cancelar edição
    if (this.editingCategory()?.id === category.id) {
      this.editingCategory.set(null);
    }
  }

  onCancelEdit() {
    this.editingCategory.set(null);
  }
}
