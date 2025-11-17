import { Component, inject, OnDestroy, OnInit, signal, HostListener, output, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  NonNullableFormBuilder,
  Validators,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import { FormValidatorService } from '@site-gazeta/form-validator';
import { Subject, takeUntil, first } from 'rxjs';
import { ApiService } from '../../../../core/services/api.service';
import { Category } from '@site-gazeta/models';

export interface CategoryConfig {
  destaquesCategoryIds: number[];
  destaquesRandomMode: boolean;
  topGazetaCategoryIds: number[];
  topGazetaRandomMode: boolean;
}

@Component({
  selector: 'app-category-config',
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  providers: [FormValidatorService],
  templateUrl: './category-config.component.html',
  styleUrl: './category-config.component.scss',
})
export class CategoryConfigComponent implements OnInit, OnDestroy {
  fb = inject(NonNullableFormBuilder);
  formValidator = inject(FormValidatorService);
  apiService = inject(ApiService);
  destroy$ = new Subject<void>();
  
  // Output para comunicar mudanças com o pai
  configChange = output<CategoryConfig>();
  
  // Input para receber dados iniciais (para edição)
  initialConfig = input<CategoryConfig | null>(null);
  
  displayError = signal<{ [key: string]: string } | null>({});
  availableCategories = signal<Category[]>([]);
  
  // Categorias em Destaque
  selectedCategories = signal<Category[]>([]);
  categoryDropdownOpen = signal<boolean>(false);
  searchTerm = signal<string>('');
  destaquesRandomMode = signal<boolean>(false);
  
  // Top Gazeta
  topGazetaCategories = signal<Category[]>([]);
  topGazetaDropdownOpen = signal<boolean>(false);
  topGazetaSearchTerm = signal<string>('');
  topGazetaRandomMode = signal<boolean>(false);

  readonly MAX_CATEGORIES = 3;

  form = this.fb.group({
    categoryIds: [[] as number[]],
    destaquesRandomMode: [false],
    topGazetaCategoryIds: [[] as number[]],
    topGazetaRandomMode: [false],
  });

  errorMessage = {
    categoryIds: {
      required: 'Selecione as categorias ou ative o modo aleatório',
      minlength: `Selecione exatamente ${this.MAX_CATEGORIES} categorias`,
      maxlength: `Selecione exatamente ${this.MAX_CATEGORIES} categorias`,
    },
    topGazetaCategoryIds: {
      required: 'Selecione as categorias ou ative o modo aleatório',
      minlength: `Selecione exatamente ${this.MAX_CATEGORIES} categorias`,
      maxlength: `Selecione exatamente ${this.MAX_CATEGORIES} categorias`,
    },
  };

  ngOnInit() {
    this.formValidator
      .InitValidation(this.form, this.errorMessage)
      .pipe(takeUntil(this.destroy$))
      .subscribe((errorMessages) => {
        this.displayError.set(errorMessages);
      });

    this.loadCategories();
    
    // Atualizar validação dos Destaques quando modo aleatório mudar
    this.form.get('destaquesRandomMode')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((isRandom) => {
        this.updateDestaquesValidation(isRandom);
      });
    
    // Atualizar validação do Top Gazeta quando modo aleatório mudar
    this.form.get('topGazetaRandomMode')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((isRandom) => {
        this.updateTopGazetaValidation(isRandom);
      });

    // Emitir mudanças no formulário
    this.form.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.emitConfigChange();
      });
  }

  // Fecha dropdowns ao clicar fora
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const clickedSelector = target.closest('.category-selector');
    
    if (this.categoryDropdownOpen()) {
      const isDestaqueArea = clickedSelector && clickedSelector.hasAttribute('data-destaques');
      if (!isDestaqueArea) {
        this.categoryDropdownOpen.set(false);
        this.searchTerm.set('');
      }
    }
    
    if (this.topGazetaDropdownOpen()) {
      const isTopGazetaArea = clickedSelector?.hasAttribute('data-top-gazeta');
      if (!isTopGazetaArea) {
        this.topGazetaDropdownOpen.set(false);
        this.topGazetaSearchTerm.set('');
      }
    }
  }

  loadCategories() {
    this.apiService
      .getActiveCategories()
      .pipe(first())
      .subscribe((categories) => {
        this.availableCategories.set(categories as Category[]);
        this.loadInitialConfig();
      });
  }

  loadInitialConfig() {
    const config = this.initialConfig();
    if (config) {
      // Carregar categorias de destaques
      if (config.destaquesRandomMode) {
        this.destaquesRandomMode.set(true);
        this.form.patchValue({ destaquesRandomMode: true });
      } else if (config.destaquesCategoryIds && config.destaquesCategoryIds.length > 0) {
        const destaques = this.availableCategories().filter(cat => 
          config.destaquesCategoryIds.includes(cat.id as number)
        );
        this.selectedCategories.set(destaques);
        this.form.patchValue({ categoryIds: config.destaquesCategoryIds });
      }
      
      // Carregar Top Gazeta
      if (config.topGazetaRandomMode) {
        this.topGazetaRandomMode.set(true);
        this.form.patchValue({ topGazetaRandomMode: true });
      } else if (config.topGazetaCategoryIds && config.topGazetaCategoryIds.length > 0) {
        const topGazeta = this.availableCategories().filter(cat => 
          config.topGazetaCategoryIds.includes(cat.id as number)
        );
        this.topGazetaCategories.set(topGazeta);
        this.form.patchValue({ topGazetaCategoryIds: config.topGazetaCategoryIds });
      }
    }
  }

  private emitConfigChange() {
    const formValue = this.form.value;
    this.configChange.emit({
      destaquesCategoryIds: formValue.categoryIds || [],
      destaquesRandomMode: formValue.destaquesRandomMode || false,
      topGazetaCategoryIds: formValue.topGazetaCategoryIds || [],
      topGazetaRandomMode: formValue.topGazetaRandomMode || false,
    });
  }

  // Categorias em Destaque
  toggleDestaquesRandomMode() {
    const newValue = !this.destaquesRandomMode();
    this.destaquesRandomMode.set(newValue);
    this.form.patchValue({ destaquesRandomMode: newValue });
    
    if (newValue) {
      this.selectedCategories.set([]);
      this.form.patchValue({ categoryIds: [] });
    }
  }

  private updateDestaquesValidation(isRandom: boolean | null) {
    const control = this.form.get('categoryIds');
    if (isRandom) {
      control?.clearValidators();
    } else {
      control?.setValidators([Validators.required, Validators.minLength(3), Validators.maxLength(3)]);
    }
    control?.updateValueAndValidity();
  }

  toggleCategoryDropdown() {
    if (this.destaquesRandomMode()) {
      return;
    }
    this.categoryDropdownOpen.set(!this.categoryDropdownOpen());
    if (this.categoryDropdownOpen()) {
      this.searchTerm.set('');
    }
  }

  selectCategory(category: Category) {
    if (this.destaquesRandomMode()) {
      return;
    }
    
    const currentSelected = this.selectedCategories();
    
    if (currentSelected.length >= this.MAX_CATEGORIES) {
      alert(`Você pode selecionar no máximo ${this.MAX_CATEGORIES} categorias`);
      return;
    }

    const isAlreadySelected = currentSelected.some((cat) => cat.id === category.id);

    if (!isAlreadySelected) {
      const newSelected = [...currentSelected, category];
      this.selectedCategories.set(newSelected);
      this.updateFormCategories(newSelected);
    }

    this.categoryDropdownOpen.set(false);
    this.searchTerm.set('');
  }

  removeCategory(categoryId: number) {
    const newSelected = this.selectedCategories().filter(
      (cat) => cat.id !== categoryId
    );
    this.selectedCategories.set(newSelected);
    this.updateFormCategories(newSelected);
  }

  private updateFormCategories(categories: Category[]) {
    const categoryIds = categories.map((cat) => cat.id as number);
    this.form.patchValue({ categoryIds });
  }

  getFilteredCategories(): Category[] {
    const selectedIds = this.selectedCategories().map((cat) => cat.id);
    const available = this.availableCategories().filter(
      (cat) => !selectedIds.includes(cat.id as number)
    );

    const search = this.searchTerm().toLowerCase().trim();
    if (!search) {
      return available;
    }

    return available.filter((cat) =>
      cat.name.toLowerCase().includes(search) ||
      (cat.description && cat.description.toLowerCase().includes(search))
    );
  }

  onSearchChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchTerm.set(input.value);
  }

  // Top Gazeta Methods
  toggleTopGazetaRandomMode() {
    const newValue = !this.topGazetaRandomMode();
    this.topGazetaRandomMode.set(newValue);
    this.form.patchValue({ topGazetaRandomMode: newValue });
    
    if (newValue) {
      this.topGazetaCategories.set([]);
      this.form.patchValue({ topGazetaCategoryIds: [] });
    }
  }

  private updateTopGazetaValidation(isRandom: boolean | null) {
    const control = this.form.get('topGazetaCategoryIds');
    if (isRandom) {
      control?.clearValidators();
    } else {
      control?.setValidators([Validators.required, Validators.minLength(3), Validators.maxLength(3)]);
    }
    control?.updateValueAndValidity();
  }

  toggleTopGazetaCategoryDropdown() {
    if (this.topGazetaRandomMode()) {
      return;
    }
    this.topGazetaDropdownOpen.set(!this.topGazetaDropdownOpen());
    if (this.topGazetaDropdownOpen()) {
      this.topGazetaSearchTerm.set('');
    }
  }

  selectTopGazetaCategory(category: Category) {
    if (this.topGazetaRandomMode()) {
      return;
    }

    const currentSelected = this.topGazetaCategories();
    
    if (currentSelected.length >= this.MAX_CATEGORIES) {
      alert(`Você pode selecionar no máximo ${this.MAX_CATEGORIES} categorias`);
      return;
    }

    const isAlreadySelected = currentSelected.some((cat) => cat.id === category.id);

    if (!isAlreadySelected) {
      const newSelected = [...currentSelected, category];
      this.topGazetaCategories.set(newSelected);
      this.updateFormTopGazetaCategories(newSelected);
    }

    this.topGazetaDropdownOpen.set(false);
    this.topGazetaSearchTerm.set('');
  }

  removeTopGazetaCategory(categoryId: number) {
    const newSelected = this.topGazetaCategories().filter(
      (cat) => cat.id !== categoryId
    );
    this.topGazetaCategories.set(newSelected);
    this.updateFormTopGazetaCategories(newSelected);
  }

  private updateFormTopGazetaCategories(categories: Category[]) {
    const categoryIds = categories.map((cat) => cat.id as number);
    this.form.patchValue({ topGazetaCategoryIds: categoryIds });
  }

  getFilteredTopGazetaCategories(): Category[] {
    const selectedTopGazetaIds = this.topGazetaCategories().map((cat) => cat.id);
    const available = this.availableCategories().filter(
      (cat) => !selectedTopGazetaIds.includes(cat.id as number)
    );

    const search = this.topGazetaSearchTerm().toLowerCase().trim();
    if (!search) {
      return available;
    }

    return available.filter((cat) =>
      cat.name.toLowerCase().includes(search) ||
      (cat.description && cat.description.toLowerCase().includes(search))
    );
  }

  onTopGazetaSearchChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.topGazetaSearchTerm.set(input.value);
  }

  // Método público para validação
  isValid(): boolean {
    // Validar Destaques
    if (!this.destaquesRandomMode() && this.selectedCategories().length < this.MAX_CATEGORIES) {
      return false;
    }
    // Validar Top Gazeta
    if (!this.topGazetaRandomMode() && this.topGazetaCategories().length < this.MAX_CATEGORIES) {
      return false;
    }
    return this.form.valid || (this.destaquesRandomMode() && this.topGazetaRandomMode());
  }

  // Método público para reset
  reset() {
    this.form.reset();
    this.selectedCategories.set([]);
    this.destaquesRandomMode.set(false);
    this.topGazetaCategories.set([]);
    this.topGazetaRandomMode.set(false);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
