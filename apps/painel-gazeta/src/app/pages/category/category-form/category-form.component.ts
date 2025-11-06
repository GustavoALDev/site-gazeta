import { tap } from 'rxjs';
import { Component,  inject, input, output, signal, computed } from '@angular/core';

import { NonNullableFormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Category, HexColor, isValidHexColor } from '@site-gazeta/models';
import { ApiService } from '../../../core/services/api.service';
import { ColorPickerComponent } from '@site-gazeta/color-picker';

@Component({
  selector: 'app-category-form',
  imports: [ReactiveFormsModule, ColorPickerComponent],
  templateUrl: './category-form.component.html',
  styleUrl: './category-form.component.scss',
})
export class CategoryFormComponent {
  fb = inject(NonNullableFormBuilder);
  apiService = inject(ApiService);
  editingCategory = input(null, {transform: (category: Category | null) => {
    if(category){
      this.setEditingCategory(category);
    }else{
      this.setEditingCategory(null);
    }
    return category;
  }});
  usedColors = input<HexColor[]>([]);
  isEditing = signal(false);
  categorySubmit = output<Category>();
  cancelEdit = output<void>();
  
  // Color picker state
  selectedColor = signal<HexColor>('#3b82f6');

  form = this.fb.group({
    name: ['', Validators.required],
    description: ['',],
    slug: [''],
    isActive: [true]
  });
  
  // Computed property to check if current color is available
  isColorAvailable = computed(() => {
    const currentColor = this.selectedColor();
    const used = this.usedColors();
    const editingCategory = this.editingCategory();
    
    // If editing, allow the current category's color
    if (editingCategory && editingCategory.color === currentColor) {
      return true;
    }
    
    // Otherwise, check if color is not used
    return !used.includes(currentColor);
  });
  
 
  setEditingCategory(category: Category | null) {
    if(category){
      this.form.patchValue({
        name: category.name,
        description: category.description,
        isActive: category.isActive,
        slug: category.slug
      });
      this.selectedColor.set(category.color as HexColor);
      this.isEditing.set(true);
    }else{
      this.form.reset({ isActive: true });
      this.selectedColor.set('#3b82f6');
      this.isEditing.set(false);
    }
  }
  
  onColorChange(color: HexColor) {
    this.selectedColor.set(color);
  }
 

  onSubmit() {
    if (this.form.valid && this.isColorAvailable()) {
      const formValue = this.form.value;
      const categoryData: Category = {
        name: formValue.name as string,
        description: formValue.description as string,
        slug: this.generateSlug(formValue.name as string),
        isActive: formValue.isActive,
        color: this.selectedColor()
      };

      if (this.isEditing()) {
        categoryData.id = this.editingCategory()?.id as number;
        
        console.log('chamou')
        this.apiService.editCategory(categoryData.id, categoryData)
        .pipe(
          tap(()=> console.log('passou aqui'))
        )
        .subscribe({
          next: (res) => {
            this.categorySubmit.emit(res as Category);
          },
          error:(error)=>{
            throw error
          }
        });
      }else{
      this.apiService.setCategory(categoryData)
      .subscribe({
        next: (res) => {
          console.log(res);
          this.categorySubmit.emit(res as Category);
        },
        error: (err) => {
          console.error(err);
        }
      });
    }
      if (!this.isEditing()) {
        this.form.reset({ isActive: true });
      }
    }
  }

  onCancel() {
    this.form.reset({ isActive: true });
    this.selectedColor.set('#3b82f6');
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
