import {
  Component,
  ChangeDetectionStrategy,
  signal,
  input,
  output,
  computed,
  viewChild,
  ElementRef,
  forwardRef,
  afterRenderEffect,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MultiSelectConfig, MultiSelectItem } from '../../models/multi-select.model';



const DEFAULT_CONFIG: Required<MultiSelectConfig> = {
  placeholder: 'Nenhum item selecionado',
  searchPlaceholder: 'Buscar...',
  emptyMessage: 'Nenhum item disponível',
  noResultsMessage: 'Nenhum item encontrado',
  addButtonLabel: 'Adicionar Item',
  addMoreButtonLabel: 'Adicionar mais itens',
  showSearch: true,
  maxHeight: '250px',
  disabled: false,
};

@Component({
  selector: 'multi-select',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './multi-select.component.html',
  styleUrl: './multi-select.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MultiSelectComponent),
      multi: true,
    },
  ],
})
export class MultiSelectComponent implements ControlValueAccessor {
  // ViewChild para gerenciar focus
  private dropdownContainer = viewChild<ElementRef<HTMLDivElement>>('dropdownContainer');
  private dropdownMenu = viewChild<ElementRef<HTMLDivElement>>('dropdownMenu');
  private searchInput = viewChild<ElementRef<HTMLInputElement>>('searchInput');

  // Inputs - Genéricos para aceitar qualquer tipo de array
  // Os objetos devem ter pelo menos: { id: string | number, label: string }
  items = input.required<any[]>();
  config = input<Partial<MultiSelectConfig>>({});
  selectedItems = input<any[]>([]);

  // Outputs - Retornam o mesmo tipo que foi passado
  selectedItemsChange = output<any[]>();
  dropdownStateChange = output<boolean>();

  // Signals internos
  protected searchTerm = signal<string>('');
  protected dropdownOpen = signal<boolean>(false);
  protected touched = signal<boolean>(false);
  protected internalDisabled = signal<boolean>(false);

  // Configuração computada
  readonly mergedConfig = computed<Required<MultiSelectConfig>>(() => ({
    ...DEFAULT_CONFIG,
    ...this.config(),
  }));

  // Itens filtrados
  readonly filteredItems = computed(() => {
    const term = this.searchTerm().toLowerCase().trim();
    const allItems = this.items();

    if (!term) {
      return allItems;
    }

    return allItems.filter((item: any) => {
      const label = (item.label? item.label : item.name || '').toLowerCase();
      const description = (item.description || '').toLowerCase();
      return label.includes(term) || description.includes(term);
    });
  });

  // Verificar se está desabilitado
  readonly isDisabled = computed(
    () => this.mergedConfig().disabled || this.internalDisabled()
  );

  // ControlValueAccessor
  private onChange: (value: any[]) => void = () => {};
  private onTouched: () => void = () => {};


constructor() {
  afterRenderEffect(() => {
    if (this.dropdownOpen()) {
      const element = this.dropdownMenu()?.nativeElement;
      if (element && element !== document.activeElement) {
        element.focus();
      }
    }
  });
}

  /**
   * Verifica se um item está selecionado
   */
  isItemSelected(item: any): boolean {
    return this.selectedItems().some((s: any) => s.id === item.id);
  }

  /**
   * Alterna o estado do dropdown
   */
  toggleDropdown(event?: Event): void {
    if (this.isDisabled()) return;

    event?.preventDefault();
    event?.stopPropagation();

    const newState = !this.dropdownOpen();
    this.dropdownOpen.set(newState);
    this.dropdownStateChange.emit(newState);

    if (!newState) {
      this.searchTerm.set('');
      this.markAsTouched();
    }
  }

  /**
   * Fecha o dropdown
   */
  closeDropdown(): void {
    this.dropdownOpen.set(false);
    this.searchTerm.set('');
    this.dropdownStateChange.emit(false);
    this.markAsTouched();
  }

  /**
   * Manipula mudanças no campo de busca
   */
  onSearchChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchTerm.set(input.value);
  }

  /**
   * Seleciona/desseleciona um item
   */
  selectItem(item: any, event?: Event): void {
    if (this.isDisabled() || item.disabled) return;

    event?.preventDefault();
    event?.stopPropagation();

    const current = [...this.selectedItems()];
    const index = current.findIndex((s: any) => s.id === item.id);

    if (index >= 0) {
      current.splice(index, 1);
    } else {
      current.push(item);
    }

    this.emitChange(current);
  }

  /**
   * Remove um item selecionado
   */
  removeItem(item: any, event?: Event): void {
    if (this.isDisabled()) return;

    event?.preventDefault();
    event?.stopPropagation();

    const current = this.selectedItems().filter((s: any) => s.id !== item.id);
    this.emitChange(current);
  }

  /**
   * Manipula o blur no container do dropdown
   */
  onDropdownBlur(event: FocusEvent): void {
    const relatedTarget = event.relatedTarget as HTMLElement;
    const currentTarget = event.currentTarget as HTMLElement;
    // Verifica se o foco saiu completamente do componente
    if (!currentTarget.contains(relatedTarget)) {
      setTimeout(() => {
        this.closeDropdown();
      }, 150);
    }
  }

  /**
   * Manipula teclas de atalho
   */
  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      this.closeDropdown();
    }
  }

  /**
   * Emite mudanças para o parent
   */
  private emitChange(items: any[]): void {
    this.selectedItemsChange.emit(items);
    this.onChange(items);
  }

  /**
   * Marca como touched
   */
  private markAsTouched(): void {
    if (!this.touched()) {
      this.touched.set(true);
      this.onTouched();
    }
  }

  // ControlValueAccessor implementation
  writeValue(value: any[]): void {
    // O valor é gerenciado externamente via input signal
  }

  registerOnChange(fn: (value: any[]) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.internalDisabled.set(isDisabled);
  }
}
