import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { MultiSelectComponent, MultiSelectItem, MultiSelectConfig } from './multi-select.component';

describe('MultiSelectComponent', () => {
  let component: MultiSelectComponent;
  let fixture: ComponentFixture<MultiSelectComponent>;

  const mockItems: MultiSelectItem[] = [
    { id: 1, label: 'Item 1', description: 'Description 1' },
    { id: 2, label: 'Item 2', description: 'Description 2' },
    { id: 3, label: 'Item 3', description: 'Description 3' },
    { id: 4, label: 'Item 4', disabled: true },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MultiSelectComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MultiSelectComponent);
    component = fixture.componentInstance;
    
    // Set required inputs usando fixture.componentRef
    fixture.componentRef.setInput('items', mockItems);
    fixture.componentRef.setInput('selectedItems', []);
    fixture.componentRef.setInput('config', {});
    
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Initialization', () => {
    it('should initialize with empty selection', () => {
      expect(component.selectedItems()).toEqual([]);
    });

    it('should apply default config', () => {
      const config = component.mergedConfig();
      expect(config.placeholder).toBe('Nenhum item selecionado');
      expect(config.showSearch).toBe(true);
      expect(config.disabled).toBe(false);
    });

    it('should merge custom config with defaults', () => {
      const customConfig: Partial<MultiSelectConfig> = {
        placeholder: 'Custom placeholder',
        maxHeight: '500px'
      };
      
      fixture.componentRef.setInput('config', customConfig);
      fixture.detectChanges();
      
      const config = component.mergedConfig();
      expect(config.placeholder).toBe('Custom placeholder');
      expect(config.maxHeight).toBe('500px');
      expect(config.showSearch).toBe(true); // Default mantido
    });
  });

  describe('Item Selection', () => {
    it('should check if item is selected', () => {
      const selectedItems = [mockItems[0]];
      fixture.componentRef.setInput('selectedItems', selectedItems);
      fixture.detectChanges();

      expect(component.isItemSelected(mockItems[0])).toBe(true);
      expect(component.isItemSelected(mockItems[1])).toBe(false);
    });

    it('should select an item', () => {
      let emittedItems: MultiSelectItem[] = [];
      component.selectedItemsChange.subscribe(items => emittedItems = items);

      component.selectItem(mockItems[0]);

      expect(emittedItems).toContain(mockItems[0]);
      expect(emittedItems.length).toBe(1);
    });

    it('should deselect an already selected item', () => {
      fixture.componentRef.setInput('selectedItems', [mockItems[0], mockItems[1]]);
      fixture.detectChanges();

      let emittedItems: MultiSelectItem[] = [];
      component.selectedItemsChange.subscribe(items => emittedItems = items);

      component.selectItem(mockItems[0]);

      expect(emittedItems).not.toContain(mockItems[0]);
      expect(emittedItems).toContain(mockItems[1]);
      expect(emittedItems.length).toBe(1);
    });

    it('should not select disabled item', () => {
      let emittedItems: MultiSelectItem[] = [];
      component.selectedItemsChange.subscribe(items => emittedItems = items);

      component.selectItem(mockItems[3]); // Disabled item

      expect(emittedItems.length).toBe(0);
    });

    it('should remove selected item', () => {
      fixture.componentRef.setInput('selectedItems', [mockItems[0], mockItems[1]]);
      fixture.detectChanges();

      let emittedItems: MultiSelectItem[] = [];
      component.selectedItemsChange.subscribe(items => emittedItems = items);

      component.removeItem(mockItems[0]);

      expect(emittedItems).not.toContain(mockItems[0]);
      expect(emittedItems).toContain(mockItems[1]);
      expect(emittedItems.length).toBe(1);
    });
  });

  describe('Dropdown State', () => {
    it('should toggle dropdown open/close', () => {
      let dropdownState = false;
      component.dropdownStateChange.subscribe(state => dropdownState = state);

      component.toggleDropdown();
      expect(dropdownState).toBe(true);

      component.toggleDropdown();
      expect(dropdownState).toBe(false);
    });

    it('should close dropdown', () => {
      // First open it
      component.toggleDropdown();
      expect(component['dropdownOpen']()).toBe(true);

      // Then close it
      component.closeDropdown();
      expect(component['dropdownOpen']()).toBe(false);
    });

    it('should not toggle when disabled', () => {
      fixture.componentRef.setInput('config', { disabled: true });
      fixture.detectChanges();

      component.toggleDropdown();
      expect(component['dropdownOpen']()).toBe(false);
    });
  });

  describe('Search Functionality', () => {
    it('should filter items by label', () => {
      const searchEvent = { target: { value: 'Item 1' } } as any;
      component.onSearchChange(searchEvent);
      
      const filtered = component.filteredItems();
      expect(filtered.length).toBe(1);
      expect(filtered[0].label).toBe('Item 1');
    });

    it('should filter items by description', () => {
      const searchEvent = { target: { value: 'Description 2' } } as any;
      component.onSearchChange(searchEvent);
      
      const filtered = component.filteredItems();
      expect(filtered.length).toBe(1);
      expect(filtered[0].description).toBe('Description 2');
    });

    it('should return all items when search is empty', () => {
      const searchEvent = { target: { value: '' } } as any;
      component.onSearchChange(searchEvent);
      
      const filtered = component.filteredItems();
      expect(filtered.length).toBe(mockItems.length);
    });

    it('should be case insensitive', () => {
      const searchEvent = { target: { value: 'item 1' } } as any;
      component.onSearchChange(searchEvent);
      
      const filtered = component.filteredItems();
      expect(filtered.length).toBe(1);
      expect(filtered[0].label).toBe('Item 1');
    });

    it('should return empty array when no match', () => {
      const searchEvent = { target: { value: 'NonExistent' } } as any;
      component.onSearchChange(searchEvent);
      
      const filtered = component.filteredItems();
      expect(filtered.length).toBe(0);
    });
  });

  describe('Keyboard Interactions', () => {
    it('should close dropdown on Escape key', () => {
      component.toggleDropdown();
      expect(component['dropdownOpen']()).toBe(true);

      const escapeEvent = new KeyboardEvent('keydown', { key: 'Escape' });
      component.onKeyDown(escapeEvent);

      expect(component['dropdownOpen']()).toBe(false);
    });
  });

  describe('Disabled State', () => {
    it('should be disabled when config.disabled is true', () => {
      fixture.componentRef.setInput('config', { disabled: true });
      fixture.detectChanges();

      expect(component.isDisabled()).toBe(true);
    });

    it('should not allow selection when disabled', () => {
      fixture.componentRef.setInput('config', { disabled: true });
      fixture.detectChanges();

      let emittedItems: MultiSelectItem[] = [];
      component.selectedItemsChange.subscribe(items => emittedItems = items);

      component.selectItem(mockItems[0]);

      expect(emittedItems.length).toBe(0);
    });

    it('should not allow removal when disabled', () => {
      fixture.componentRef.setInput('selectedItems', [mockItems[0]]);
      fixture.componentRef.setInput('config', { disabled: true });
      fixture.detectChanges();

      let emittedItems: MultiSelectItem[] | undefined;
      component.selectedItemsChange.subscribe(items => emittedItems = items);

      component.removeItem(mockItems[0]);

      expect(emittedItems).toBeUndefined();
    });
  });

  describe('ControlValueAccessor', () => {
    it('should register onChange callback', () => {
      const onChangeSpy = jasmine.createSpy('onChange');
      component.registerOnChange(onChangeSpy);

      component.selectItem(mockItems[0]);

      expect(onChangeSpy).toHaveBeenCalledWith([mockItems[0]]);
    });

    it('should register onTouched callback', () => {
      const onTouchedSpy = jasmine.createSpy('onTouched');
      component.registerOnTouched(onTouchedSpy);

      component.closeDropdown();

      expect(onTouchedSpy).toHaveBeenCalled();
    });

    it('should set disabled state', () => {
      component.setDisabledState(true);
      expect(component['internalDisabled']()).toBe(true);

      component.setDisabledState(false);
      expect(component['internalDisabled']()).toBe(false);
    });
  });

  describe('Blur Behavior', () => {
    it('should close dropdown on blur when focus leaves component', (done) => {
      component.toggleDropdown();
      expect(component['dropdownOpen']()).toBe(true);

      const blurEvent = {
        relatedTarget: null, // Focus left component
        currentTarget: document.createElement('div')
      } as any;

      component.onDropdownBlur(blurEvent);

      // Wait for the timeout in the blur handler
      setTimeout(() => {
        expect(component['dropdownOpen']()).toBe(false);
        done();
      }, 200);
    });

    it('should not close dropdown on blur when focus stays in component', () => {
      component.toggleDropdown();
      expect(component['dropdownOpen']()).toBe(true);

      const container = document.createElement('div');
      const relatedElement = document.createElement('input');
      container.appendChild(relatedElement);

      const blurEvent = {
        relatedTarget: relatedElement,
        currentTarget: container
      } as any;

      component.onDropdownBlur(blurEvent);

      expect(component['dropdownOpen']()).toBe(true);
    });
  });
});
