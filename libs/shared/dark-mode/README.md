# Dark Mode Service

Serviço para gerenciar o estado do dark mode na aplicação.

## Funcionalidades

- ✅ Toggle entre modo claro e escuro
- ✅ Persistência da preferência no localStorage
- ✅ Detecção automática da preferência do sistema
- ✅ Observable para reatividade
- ✅ Suporte a SSR (Server Side Rendering)

## Como usar

### 1. Importar o serviço

```typescript
import { DarkModeService } from '@site-gazeta/dark-mode';
```

### 2. Injetar no componente

```typescript
export class MyComponent {
  isDarkMode$ = this.darkModeService.isDarkMode$;

  constructor(private darkModeService: DarkModeService) {}

  toggleDarkMode(): void {
    this.darkModeService.toggleDarkMode();
  }
}
```

### 3. Usar no template

```html
<button (click)="toggleDarkMode()">
  {{ (isDarkMode$ | async) ? '☀️ Modo Claro' : '🌙 Modo Escuro' }}
</button>
```

## Estilos CSS

O serviço adiciona/remove a classe `dark-mode` no `document.body`. Use CSS variables para definir os estilos:

```scss
:root {
  --bg-color: #ffffff;
  --text-color: #333333;
}

.dark-mode {
  --bg-color: #121212;
  --text-color: #e0e0e0;
}

body {
  background-color: var(--bg-color);
  color: var(--text-color);
  transition: background-color 0.3s ease, color 0.3s ease;
}
```

## Exemplo no Header

O componente header já implementa o dark mode toggle com um botão estilizado que mostra:
- 🌙 "Escuro" no modo claro
- ☀️ "Claro" no modo escuro
