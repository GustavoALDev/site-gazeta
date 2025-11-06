import { Component, input, output, signal, computed, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HexColor, isValidHexColor, generateRandomHexColor } from '@site-gazeta/models';

@Component({
  selector: 'app-color-picker',
  imports: [FormsModule],
  templateUrl: './color-picker.component.html',
  styleUrl: './color-picker.component.scss',
})
export class ColorPickerComponent implements OnInit {
  // Inputs
  selectedColor = input.required<HexColor>();
  usedColors = input<HexColor[]>([]);
  disabled = input(false);
  
  // Outputs
  colorChange = output<HexColor>();
  
  // Internal state
  isOpen = signal(false);
  customColor = signal<HexColor>('#3b82f6');
  
  // Predefined color palette
  predefinedColors: HexColor[] = [
    '#ef4444', // red-500
    '#f97316', // orange-500
    '#eab308', // yellow-500
    '#22c55e', // green-500
    '#06b6d4', // cyan-500
    '#3b82f6', // blue-500
    '#8b5cf6', // violet-500
    '#ec4899', // pink-500
    '#6b7280', // gray-500
    '#1f2937', // gray-800
    '#dc2626', // red-600
    '#ea580c', // orange-600
    '#ca8a04', // yellow-600
    '#16a34a', // green-600
    '#0891b2', // cyan-600
    '#2563eb', // blue-600
    '#7c3aed', // violet-600
    '#db2777', // pink-600
    '#4b5563', // gray-600
    '#111827', // gray-900
  ];
  
  // Computed properties
  availableColors = computed(() => {
    const used = this.usedColors();
    return this.predefinedColors.filter(color => !used.includes(color));
  });
  
  isColorUsed = computed(() => {
    const used = this.usedColors();
    return (color: HexColor) => used.includes(color);
  });
  
  ngOnInit() {
    this.customColor.set(this.selectedColor());
  }
  
  onColorSelect(color: HexColor) {
    if (!this.isColorUsed()(color)) {
      this.colorChange.emit(color);
      this.isOpen.set(false);
    }
  }
  
  onCustomColorChange(event: Event) {
    const target = event.target as HTMLInputElement;
    const color = target.value as HexColor;
    
    if (isValidHexColor(color)) {
      this.customColor.set(color);
      if (!this.isColorUsed()(color)) {
        this.colorChange.emit(color);
      }
    }
  }
  
  onRandomColor() {
    let randomColor: HexColor;
    let attempts = 0;
    const maxAttempts = 50;
    
    do {
      randomColor = generateRandomHexColor();
      attempts++;
    } while (this.isColorUsed()(randomColor) && attempts < maxAttempts);
    
    if (attempts < maxAttempts) {
      this.customColor.set(randomColor);
      this.colorChange.emit(randomColor);
    }
  }
  
  togglePicker() {
    if (!this.disabled()) {
      this.isOpen.update(open => !open);
    }
  }
  
  closePicker() {
    this.isOpen.set(false);
  }
}
