import { Component, inject, signal, effect, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MenuService } from '../../../core/services/menu.service';
import { CategoryService } from '../../../core/services/category.service';
import { Category, Menu } from '@site-gazeta/models';

type MenuType = 'external' | 'internal' | 'category' | 'submenu';

interface InternalRoute {
  path: string;
  label: string;
}

@Component({
  selector: 'app-menu-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './menu-form.component.html',
  styleUrl: './menu-form.component.scss',
})
export class MenuFormComponent {
  private fb = inject(FormBuilder);
  private menuService = inject(MenuService);
  private categoryService = inject(CategoryService);

  // Inputs & Outputs
  menuToEdit = input<Menu | null>(null);
  parentMenu = input<Menu | null>(null);
  existingMenus = input<Menu[]>([]);
  onSave = output<Menu>();
  onCancel = output<void>();

  // Signals
  menuForm!: FormGroup;
  selectedType = signal<MenuType>('internal');
  categories = signal<Category[]>([]);
  isLoading = signal(false);
  showCategoryDropdown = signal(false);
  
  // Rotas internas disponíveis
  internalRoutes: InternalRoute[] = [
    { path: '/', label: 'Home' },
    { path: '/noticias', label: 'Notícias' },
    { path: '/videos', label: 'Vídeos' },
    { path: '/sobre', label: 'Sobre' },
    { path: '/contato', label: 'Contato' }
  ];

  constructor() {
    this.initForm();
    this.loadCategories();
    
    // Effect para atualizar form quando receber menu para editar
    effect(() => {
      const menu = this.menuToEdit();
      if (menu) {
        this.loadMenuForEdit(menu);
      } else {
        // Se não está editando, calcular próxima ordem disponível
        const nextOrder = this.calculateNextOrder();
        this.menuForm.patchValue({ order: nextOrder }, { emitEvent: false });
      }
    });
  }

  private initForm(): void {
    this.menuForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      type: ['internal', Validators.required],
      routerLink: [''],
      externalLink: [''],
      categoryId: [null],
      categoryName: [''],
      slug: [''],
      order: [1],
      parentId: [null]
    });

    // Listener para mudanças no tipo
    this.menuForm.get('type')?.valueChanges.subscribe((type: MenuType) => {
      this.selectedType.set(type);
      this.updateValidators(type);
    });
  }

  private updateValidators(type: MenuType): void {
    const routerLinkControl = this.menuForm.get('routerLink');
    const externalLinkControl = this.menuForm.get('external');
    const categoryIdControl = this.menuForm.get('categoryId');

    // Reset validators
    routerLinkControl?.clearValidators();
    externalLinkControl?.clearValidators();
    categoryIdControl?.clearValidators();

    // Apply validators based on type
    switch (type) {
      case 'internal':
        routerLinkControl?.setValidators([Validators.required]);
        break;
      case 'external':
        externalLinkControl?.setValidators([Validators.required, Validators.pattern(/^https?:\/\/.+/)]);
        this.menuForm.patchValue({ name: '' }); // Limpar nome para forçar preenchimento
        break;
      case 'category':
        categoryIdControl?.setValidators([Validators.required]);
        break;
      case 'submenu':
        // Submenu só precisa do nome
        break;
    }

    routerLinkControl?.updateValueAndValidity();
    externalLinkControl?.updateValueAndValidity();
    categoryIdControl?.updateValueAndValidity();
  }

  private loadCategories(): void {
    this.categoryService.getActive().subscribe({
      next: (categories) => this.categories.set(categories),
      error: (err) => console.error('Erro ao carregar categorias:', err)
    });
  }

  private calculateNextOrder(): number {
    const menus = this.existingMenus();
    if (!menus || menus.length === 0) {
      return 1;
    }
    
    // Encontrar a maior ordem existente
    const maxOrder = Math.max(...menus.map(m => m.order || 1));
    return maxOrder + 1;
  }

  private loadMenuForEdit(menu: Menu): void {
    this.selectedType.set((menu.type as MenuType) || 'internal');
    this.menuForm.patchValue({
      name: menu.name,
      type: menu.type || 'internal',
      routerLink: menu.routerLink || '',
      externalLink: menu.externalLink || '',
      slug: menu.slug || '',
      order: menu.order || 1,
      parentId: menu.parentId || null
    });
  }

  selectCategory(category: Category): void {
    this.menuForm.patchValue({
      categoryId: category.id,
      categoryName: category.name,
      name: category.name,
      slug: category.slug
    });
    this.showCategoryDropdown.set(false);
  }

  toggleCategoryDropdown(): void {
    this.showCategoryDropdown.update(v => !v);
  }

  getSelectedCategory(): Category | null {
    const categoryId = this.menuForm.get('categoryId')?.value;
    return this.categories().find(c => c.id === categoryId) || null;
  }

  submitForm(): void {
    if (this.menuForm.invalid) {
      Object.keys(this.menuForm.controls).forEach(key => {
        this.menuForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.isLoading.set(true);
    const formValue = this.menuForm.value;
    const menuData: Menu = {
      name: formValue.name,
      type: formValue.type,
      order: formValue.order || 1,
      ...(formValue.type === 'internal' && { routerLink: formValue.routerLink }),
      ...(formValue.type === 'external' && { externalLink: formValue.externalLink }),
      ...(formValue.type === 'category' && { slug: formValue.slug }),
      ...(formValue.parentId && { parentId: formValue.parentId }),
    };

    const menuToEdit = this.menuToEdit();
    const apiCall = menuToEdit 
      ? this.menuService.update(menuToEdit.id!, menuData)
      : this.menuService.create(menuData);

    apiCall.subscribe({
      next: (menu) => {
        this.isLoading.set(false);
        this.onSave.emit(menu as Menu);
        this.resetForm();
      },
      error: (err) => {
        this.isLoading.set(false);
        console.error('Erro ao salvar menu:', err);
      }
    });
  }

  resetForm(): void {
    const nextOrder = this.calculateNextOrder();
    this.menuForm.reset({ type: 'internal', order: nextOrder, parentId: null });
    this.selectedType.set('internal');
  }

  cancel(): void {
    this.resetForm();
    this.onCancel.emit();
  }

  // Getters para validação
  get nameControl() { return this.menuForm.get('name'); }
  get routerLinkControl() { return this.menuForm.get('routerLink'); }
  get externalLinkControl() { return this.menuForm.get('externalLink'); }
  get categoryIdControl() { return this.menuForm.get('categoryId'); }
}
