import { Component,  inject, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NonNullableFormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Category } from '@site-gazeta/models';

@Component({
  selector: 'app-category-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './category-form.component.html',
  styleUrl: './category-form.component.scss',
})
export class CategoryFormComponent {
  fb = inject(NonNullableFormBuilder);

  editingCategory = input(null, {transform: (category: Category | null) => {
    if(category){
      this.setEditingCategory(category);
    }else{
      this.setEditingCategory(null);
    }
    return category;
  }});
  isEditing = signal(false);
  categorySubmit = output<Category>();
  cancelEdit = output<void>();

  form = this.fb.group({
    name: ['', Validators.required],
    description: ['',],
    slug: [''],
    isActive: [true]
  });
  
 
  setEditingCategory(category: Category | null) {
    if(category){
      this.form.patchValue({
        name: category.name,
        description: category.description,
        isActive: category.isActive
      });
      this.isEditing.set(true);
    }else{
      this.form.reset({ isActive: true });
      this.isEditing.set(false);
    }
  }
 

  onSubmit() {
    if (this.form.valid) {
      const formValue = this.form.value;
      const categoryData: Category = {
        name: formValue.name as string,
        description: formValue.description as string,
        slug: this.generateSlug(formValue.name as string),
        isActive: formValue.isActive as boolean,
      };

      if (this.isEditing()) {
        categoryData.id = this.editingCategory()?.id as number;
        categoryData.createdAt = this.editingCategory()?.createdAt as string;
      }

      this.categorySubmit.emit(categoryData);
      
      if (!this.isEditing()) {
        this.form.reset({ isActive: true });
      }
    }
  }

  onCancel() {
    this.form.reset({ isActive: true });
    this.cancelEdit.emit();
  }

  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }
}
