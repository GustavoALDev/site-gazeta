# Color Picker Component

Um componente reutilizável para seleção de cores em formato HEX com validação de cores únicas.

## Características

- ✅ Seleção de cores predefinidas
- ✅ Input personalizado para cores HEX
- ✅ Geração de cores aleatórias
- ✅ Validação de cores únicas
- ✅ Interface responsiva
- ✅ Feedback visual para cores em uso
- ✅ Suporte a cores HEX de 3 e 6 dígitos

## Como Usar

### 1. Importar o Componente

```typescript
import { ColorPickerComponent } from '@site-gazeta/color-picker';

@Component({
  selector: 'app-example',
  imports: [ColorPickerComponent],
  // ...
})
export class ExampleComponent {
  selectedColor = signal<HexColor>('#3b82f6');
  usedColors = signal<HexColor[]>(['#ef4444', '#22c55e']);
  
  onColorChange(color: HexColor) {
    this.selectedColor.set(color);
  }
}
```

### 2. Usar no Template

```html
<app-color-picker
  [selectedColor]="selectedColor()"
  [usedColors]="usedColors()"
  [disabled]="false"
  (colorChange)="onColorChange($event)"
/>
```

### 3. Propriedades

| Propriedade | Tipo | Obrigatório | Descrição |
|-------------|------|-------------|-----------|
| `selectedColor` | `HexColor` | ✅ | Cor atualmente selecionada |
| `usedColors` | `HexColor[]` | ❌ | Array de cores já em uso |
| `disabled` | `boolean` | ❌ | Desabilita o componente |

### 4. Eventos

| Evento | Tipo | Descrição |
|--------|------|-----------|
| `colorChange` | `HexColor` | Emitido quando uma nova cor é selecionada |

## Exemplo Completo

```typescript
import { Component, signal, computed } from '@angular/core';
import { ColorPickerComponent } from '@site-gazeta/color-picker';
import { HexColor } from '@site-gazeta/models';

@Component({
  selector: 'app-category-form',
  imports: [ColorPickerComponent],
  template: `
    <div class="form-group">
      <label>Cor da Categoria</label>
      <app-color-picker
        [selectedColor]="selectedColor()"
        [usedColors]="usedColors()"
        (colorChange)="onColorChange($event)"
      />
    </div>
  `
})
export class CategoryFormComponent {
  selectedColor = signal<HexColor>('#3b82f6');
  usedColors = signal<HexColor[]>([]);
  
  onColorChange(color: HexColor) {
    this.selectedColor.set(color);
  }
}
```

## Validação de Cores Únicas

O componente automaticamente:
- Marca cores já utilizadas como indisponíveis
- Mostra feedback visual para cores em uso
- Permite reutilizar a cor da categoria atual durante edição
- Bloqueia seleção de cores duplicadas

## Cores Predefinidas

O componente inclui 20 cores predefinidas organizadas em uma paleta moderna:
- Vermelhos, laranjas, amarelos
- Verdes, cianos, azuis
- Violetas, rosas, cinzas
- Tons claros e escuros

## Funcionalidades Avançadas

- **Input de Cor Nativo**: Suporte ao input type="color" do navegador
- **Input HEX Manual**: Digite cores HEX diretamente
- **Gerador Aleatório**: Botão para gerar cores aleatórias não utilizadas
- **Validação HEX**: Validação automática de formato HEX
- **Responsivo**: Interface adaptável para mobile e desktop
