# Modal Component

Um componente de modal genérico e reutilizável para apresentação de conteúdo em todos os projetos.

## Características

- ✅ Modal genérico para qualquer tipo de conteúdo
- ✅ Projeção de conteúdo via `ng-content`
- ✅ Controle automático de scroll do body
- ✅ Animações suaves de entrada/saída
- ✅ Responsivo para mobile, tablet e desktop
- ✅ Suporte a safe-area-inset para dispositivos com notch
- ✅ Acessibilidade (ARIA attributes)
- ✅ Backdrop com blur effect
- ✅ Botão de fechar com animação

## Como Usar

### 1. Importar o Componente

```typescript
import { ModalComponent } from '@site-gazeta/modal';

@Component({
  selector: 'app-example',
  imports: [ModalComponent],
  // ...
})
export class ExampleComponent {
  isModalOpen = signal(false);

  openModal() {
    this.isModalOpen.set(true);
  }

  closeModal() {
    this.isModalOpen.set(false);
  }
}
```

### 2. Usar no Template

```html
<lib-modal 
  [(isOpen)]="isModalOpen"
  (closed)="closeModal()">
  
  <!-- Seu conteúdo aqui -->
  <div class="custom-content">
    <h2>Título do Modal</h2>
    <p>Conteúdo do modal...</p>
  </div>
</lib-modal>
```

### 3. Exemplo Completo

```typescript
import { Component, signal } from '@angular/core';
import { ModalComponent } from '@site-gazeta/modal';

@Component({
  selector: 'app-example',
  imports: [ModalComponent],
  template: `
    <button (click)="openModal()">Abrir Modal</button>
    
    <lib-modal 
      [(isOpen)]="isModalOpen"
      (closed)="onModalClosed()">
      
      <div class="modal-content-wrapper">
        <h2>Meu Modal</h2>
        <p>Este é um exemplo de uso do modal genérico.</p>
        <button (click)="closeModal()">Fechar</button>
      </div>
    </lib-modal>
  `
})
export class ExampleComponent {
  isModalOpen = signal(false);

  openModal() {
    this.isModalOpen.set(true);
  }

  closeModal() {
    this.isModalOpen.set(false);
  }

  onModalClosed() {
    console.log('Modal foi fechado');
  }
}
```

## Propriedades

| Propriedade | Tipo | Descrição |
|-------------|------|-----------|
| `isOpen` | `WritableSignal<boolean>` | Controla se o modal está aberto ou fechado (two-way binding) |

## Eventos

| Evento | Tipo | Descrição |
|--------|------|-----------|
| `closed` | `void` | Emitido quando o modal é fechado |

## Métodos Públicos

| Método | Descrição |
|--------|-----------|
| `open()` | Abre o modal programaticamente |
| `close()` | Fecha o modal programaticamente |
| `toggle()` | Alterna o estado do modal (abre/fecha) |

## Comportamento

- **Scroll do Body**: O scroll do body é automaticamente bloqueado quando o modal está aberto
- **Backdrop Click**: Clicar no backdrop fecha o modal
- **Escape Key**: (Pode ser implementado no componente que usa o modal)
- **Responsividade**: O modal se adapta automaticamente a diferentes tamanhos de tela
- **Safe Area**: Respeita as áreas seguras de dispositivos com notch

## Estilização

O modal usa `ViewEncapsulation.None`, então os estilos são globais. Você pode estilizar o conteúdo interno usando classes CSS normais:

```scss
.custom-content {
  padding: 2rem;
  
  h2 {
    margin-bottom: 1rem;
  }
}
```

## Acessibilidade

O modal inclui:
- `role="dialog"`
- `aria-modal="true"`
- `aria-hidden` attribute
- Botão de fechar com `aria-label`

## Responsividade

O modal é totalmente responsivo e se adapta a:
- Desktop (> 768px)
- Tablet (768px)
- Mobile Landscape (≤ 768px)
- Mobile Portrait (≤ 768px)
- Mobile Pequeno (≤ 480px)

