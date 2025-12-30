import { 
  Component, 
  OnDestroy, 
  Renderer2, 
  inject, 
  DOCUMENT, 
  PLATFORM_ID,
  effect,
  input,
  model,
  output,
  ViewEncapsulation,
  computed
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Video } from '@site-gazeta/models';
import { VideoPlayerComponent } from '../video-player/video-player.component';
import { VideoModalInfoComponent } from './video-modal-info/video-modal-info.component';

@Component({
  selector: 'lib-video-modal',
  imports: [CommonModule, VideoPlayerComponent, VideoModalInfoComponent],
  templateUrl: './video-modal.component.html',
  styleUrl: './video-modal.component.scss',
  standalone: true,
  encapsulation: ViewEncapsulation.None, // Permite que os estilos sejam globais
})
export class VideoModalComponent implements OnDestroy {
  private readonly renderer = inject(Renderer2);
  private readonly document = inject(DOCUMENT);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);
  
  private bodyOverflowStyle?: string;
  video = input.required<Video>();
  // Inputs
  isOpen = model<boolean>(false);
  
  // Outputs
  closed = output<void>();
  hasVideo = computed(() => {
    const video = this.video();
    console.log(video);
  });
  constructor() {
    // Effect para controlar o scroll do body quando o modal abre/fecha
    effect(() => {
      if(this.video()){
        console.log('video', this.video());
      } else {
        console.log('no video');
      }
      if (this.isBrowser) {
        if (this.isOpen()) {
          this.lockBodyScroll();
        } else {
          this.restoreBodyOverflow();
        }
      }
    });
  }

  ngOnDestroy(): void {
    if (this.isBrowser) {
      this.restoreBodyOverflow();
    }
  }

  onBackdropClick(event: Event): void {
    // Fecha o modal ao clicar no backdrop
    if (event.target === event.currentTarget) {
      this.close();
    }
  }

  onCloseClick(): void {
    this.close();
  }

  close(): void {
    this.isOpen.set(false);
    this.closed.emit();
  }

  // Método público para abrir o modal
  open(): void {
    this.isOpen.set(true);
  }

  // Método público para fechar o modal
  toggle(): void {
    this.isOpen.set(!this.isOpen());
  }

  // Controla o overflow do body quando o modal está aberto
  private lockBodyScroll(): void {
    if (this.isBrowser) {
      this.bodyOverflowStyle = this.document.body.style.overflow;
      this.renderer.setStyle(this.document.body, 'overflow', 'hidden');
    }
  }

  private restoreBodyOverflow(): void {
    if (this.isBrowser && this.bodyOverflowStyle !== undefined) {
      this.renderer.setStyle(this.document.body, 'overflow', this.bodyOverflowStyle || '');
      this.bodyOverflowStyle = undefined;
    }
  }
}
