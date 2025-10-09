# Video Player Component

Componente de lista de vídeos para site de notícias, desenvolvido com Angular 20 usando as melhores práticas modernas (signals, control flow, standalone components).

## Características

- ✅ **Layout responsivo** com player principal e lista lateral
- ✅ **Signals** para gerenciamento de estado reativo
- ✅ **Control Flow** (@if, @for) do Angular 20
- ✅ **Indicador "Assistindo"** para o vídeo atual
- ✅ **Gradientes personalizados** com as cores #eb3237 e #0a80c4
- ✅ **Animações suaves** e interações fluidas
- ✅ **Player customizado** com controles nativos do HTML5

## Instalação

```typescript
import { VideoPlayerComponent } from '@site-gazeta/components/video-player';

@Component({
  imports: [VideoPlayerComponent],
  // ...
})
```

## Uso Básico

```typescript
import { Component, signal } from '@angular/core';
import { VideoPlayerComponent } from '@site-gazeta/components/video-player';
import { NewsVideo } from '@site-gazeta/models';

@Component({
  selector: 'app-videos-page',
  imports: [VideoPlayerComponent],
  template: `
    <lib-video-player 
      [videos]="videos()"
      [title]="'Vídeos em alta hoje'"
    />
  `
})
export class VideosPageComponent {
  videos = signal<NewsVideo[]>([
    {
      id: 1,
      url: '/videos/video1.mp4',
      thumbnail: '/images/thumb1.jpg',
      title: 'Lula recebe vaias e aplausos ao ser anunciado em evento com prefeitos',
      duration: '4 min'
    },
    {
      id: 2,
      url: '/videos/video2.mp4',
      thumbnail: '/images/thumb2.jpg',
      title: 'Tubarão é avistado no mar da Barra da Tijuca',
      duration: '2 min'
    },
    // ... mais vídeos
  ]);
}
```

## Props (Inputs)

| Nome | Tipo | Obrigatório | Padrão | Descrição |
|------|------|-------------|--------|-----------|
| `videos` | `NewsVideo[]` | Sim | - | Array de vídeos a serem exibidos |
| `title` | `string` | Não | 'Vídeos em alta hoje' | Título da seção |

## Interface NewsVideo

```typescript
interface NewsVideo {
  id?: number;
  url: string;           // URL do arquivo de vídeo
  thumbnail: string;     // URL da thumbnail
  title: string;         // Título do vídeo
  duration: string;      // Duração formatada (ex: "4 min", "1h 30min")
}
```

## Funcionalidades

### Seleção de Vídeo
Clique em qualquer vídeo da lista lateral para reproduzi-lo no player principal.

### Indicador "Assistindo"
O vídeo atual mostra um badge gradiente "ASSISTINDO" e tem um destaque visual na lista.

### Primeiro Vídeo
O primeiro vídeo da lista tem uma borda vermelha para destaque especial.

### Gradientes Customizados
- **Botões de play**: Gradiente de #eb3237 para #0a80c4
- **Badge "Assistindo"**: Gradiente animado com efeito pulse
- **Scrollbar**: Gradiente vertical nas cores do tema

## Estilização

O componente usa um tema escuro por padrão e é totalmente responsivo. As cores principais podem ser customizadas no SCSS:

```scss
$primary-red: #eb3237;
$primary-blue: #0a80c4;
```

## Responsividade

- **Desktop (>1024px)**: Layout em 2 colunas
- **Tablet (768px-1024px)**: Layout em coluna única
- **Mobile (<768px)**: Thumbnails e fontes reduzidas

## Testes

Execute `nx test video-player` para rodar os testes unitários.
