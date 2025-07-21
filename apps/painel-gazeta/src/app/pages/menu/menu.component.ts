import { Component, OnInit, inject, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Menu, Category } from '@site-gazeta/models';
import { MenuListComponent } from './menu-list/menu-list.component';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MenuListComponent],
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {
  private fb = inject(FormBuilder);
  private apiService = inject(ApiService);

  menuItems = signal<Menu[]>([]);
  categories = signal<Category[]>([]);
  currentFormType = signal<string>('');
  isFormValid = signal<boolean>(false); 

 
  menuForm!: FormGroup;


  readonly menuTypes = [
    { value: 'internal', label: 'Página' },
    { value: 'category', label: 'Categoria' },
    { value: 'external', label: 'Link Externo' }
  ] as const;

  readonly availablePages = [
    { value: 'home', label: 'Home', routerLink: '/' },
    { value: 'about', label: 'Sobre', routerLink: '/sobre' },
    { value: 'contact', label: 'Contato', routerLink: '/contato' },
    { value: 'gallery', label: 'Galeria', routerLink: '/galeria' },
    { value: 'services', label: 'Serviços', routerLink: '/servicos' }
  ] as const;

  constructor() {
    // Effect para observar mudanças no tipo do formulário
    effect(() => {
      const type = this.currentFormType();
      if (type) {
        this.clearConditionalFields();
        this.setConditionalValidators(type);
      }
    });
  }

  ngOnInit(): void {
    this.createForm();
    this.loadInitialData();
    this.setupFormSubscriptions();
  }

  private createForm(): void {
    this.menuForm = this.fb.group({
      type: ['', Validators.required],
      name: [''],
      categoryId: [''],
      pageId: [''],
      externalLink: ['']
    });
  }

  private setupFormSubscriptions(): void {
    // Observar mudanças no campo 'type' e atualizar o signal
    this.menuForm.get('type')?.valueChanges.subscribe(value => {
      this.currentFormType.set(value || '');
    });

    // Observar mudanças no status de validade do formulário
    this.menuForm.statusChanges.subscribe(status => {
      this.isFormValid.set(status === 'VALID');
    });

    // Verificar validade inicial
    this.isFormValid.set(this.menuForm.valid);
  }

  private loadInitialData(): void {
    this.loadMenuItems();
    this.loadCategories();
  }

  private loadMenuItems(): void {
    this.apiService.getMenu()
    .subscribe((response: Menu[]) => {
      this.menuItems.set(response);
    });
  }

  private loadCategories(): void {
   this.apiService.getCategories().subscribe((response: Category[]) => {
    console.log(response);
    this.categories.set(response);
   });
  }

  private clearConditionalFields(): void {
    this.menuForm.patchValue({
      name: '',
      categoryId: '',
      pageId: '',
      externalLink: ''
    });
  }

  private setConditionalValidators(type: string): void {
    const nameControl = this.menuForm.get('name');
    const categoryControl = this.menuForm.get('categoryId');
    const pageControl = this.menuForm.get('pageId');
    const externalLinkControl = this.menuForm.get('externalLink');

    // Limpar todos os validadores
    [nameControl, categoryControl, pageControl, externalLinkControl].forEach(control => {
      control?.clearValidators();
      control?.updateValueAndValidity();
    });

    const validatorsByType: {[key: string]: () => void} = {
      'category': () => {
        categoryControl?.setValidators([Validators.required]);
      },
      'internal': () => {
        nameControl?.setValidators([Validators.required, Validators.minLength(3)]);
        pageControl?.setValidators([Validators.required]);
      },
      'external': () => {
        nameControl?.setValidators([Validators.required, Validators.minLength(3)]);
        externalLinkControl?.setValidators([Validators.required, Validators.pattern(/^https?:\/\/.+/)]);
      }
    };

    // Executar a função correspondente ao tipo, se existir
    validatorsByType[type]?.();

    [nameControl, categoryControl, pageControl, externalLinkControl].forEach(control => {
      control?.updateValueAndValidity();
    });

    // Atualizar o signal de validade após aplicar os validadores
    setTimeout(() => {
      this.isFormValid.set(this.menuForm.valid);
    });
  }

  // Handlers para eventos da lista
  onMenuItemsReordered(reorderedItems: Menu[]): void {
    this.menuItems.set(reorderedItems);
    console.log('Menu reordenado:', reorderedItems);
  }

  onMenuItemDeleted(index: number): void {
    const currentItems = this.menuItems();
    const updatedItems = currentItems.filter((_, i) => i !== index);
    
    // Reordenar após remoção
    const reorderedItems = updatedItems.map((item, i) => ({
      ...item,
      order: i + 1
    }));
    
    this.menuItems.set(reorderedItems);
  }

  onSubmit(): void {
    if (!this.isFormValid()) {
      console.log('Formulário inválido:', this.menuForm.errors);
      this.markAllFieldsAsTouched();
      return;
    }

    const formValue = this.menuForm.value;
    const currentItems = this.menuItems();
    
    // Base do item com todos os campos obrigatórios
    const newItem: Menu = {
      order: currentItems.length + 1,
      name: '',
      type: formValue.type,
      slug: '',
      routerLink: '',
      externalLink: ''
    };

    switch (formValue.type) {
      case 'category': {
        const selectedCategory = this.categories().find(c => c.id === parseInt(formValue.categoryId));
        if (selectedCategory) {
          newItem.name = selectedCategory.name;
          newItem.slug = selectedCategory.slug;
          newItem.routerLink = `/categoria/${selectedCategory.slug}`;
          newItem.externalLink = 'http://';
        }
        break;
      }
      case 'internal': {
        const selectedPage = this.availablePages.find(p => p.value === formValue.pageId);
        if (selectedPage) {
          newItem.name = formValue.name;
          newItem.slug = formValue.pageId; // Usar o valor da página como slug
          newItem.routerLink = selectedPage.routerLink;
          newItem.externalLink = 'https://'+formValue.name+'.com'; // Colocar o routerLink como externalLink também
        }
        break;
      }
      case 'external':
        newItem.name = formValue.name;
        newItem.slug = formValue.name.toLowerCase().replace(/\s+/g, '-'); // Converter nome para slug
        newItem.routerLink = formValue.externalLink; // Colocar o link externo como routerLink também
        newItem.externalLink = formValue.externalLink;
        break;
    }

    console.log('Item a ser enviado:', newItem);
    
    this.apiService.setMenu(newItem)
    .subscribe({
      next: (response: Menu) => {
        console.log('Resposta da API:', response);
        this.menuItems.set([...currentItems, response]); // Usar a resposta da API em vez do newItem local
        this.clearForm();
        console.log('Novo item adicionado:', response);
      },
      error: (error) => {
        console.error('Erro ao adicionar item do menu:', error);
        // Aqui você pode adicionar uma notificação de erro para o usuário
      }
    });
  }

  clearForm(): void {
    this.menuForm.reset();
    this.currentFormType.set('');
    this.isFormValid.set(false);
  }

  private markAllFieldsAsTouched(): void {
    Object.keys(this.menuForm.controls).forEach(key => {
      this.menuForm.get(key)?.markAsTouched();
    });
  }

  getFieldError(fieldName: string): string {
    const field = this.menuForm.get(fieldName);
    if (field?.errors && field?.touched) {
      if (field.errors['required']) return `${fieldName} é obrigatório`;
      if (field.errors['minlength']) return `${fieldName} deve ter pelo menos ${field.errors['minlength'].requiredLength} caracteres`;
      if (field.errors['pattern']) return `${fieldName} deve ser uma URL válida`;
    }
    return '';
  }

 
}
