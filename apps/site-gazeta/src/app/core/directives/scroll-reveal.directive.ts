import { isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  Directive,
  ElementRef,
  Input,
  NgZone,
  OnDestroy,
  PLATFORM_ID,
  Renderer2,
  inject,
} from '@angular/core';

type ScrollRevealDirection = 'left' | 'right' | 'up' | 'down';

@Directive({
  selector: '[appScrollReveal]',
  standalone: true,
})
export class ScrollRevealDirective implements AfterViewInit, OnDestroy {
  @Input('appScrollReveal') direction: ScrollRevealDirection = 'up';
  @Input('appScrollRevealDelay') delay = 0;
  @Input('appScrollRevealThreshold') threshold = 0.2;
  @Input('appScrollRevealRootMargin') rootMargin = '0px 0px -12% 0px';

  private readonly host = inject(ElementRef<HTMLElement>);
  private readonly renderer = inject(Renderer2);
  private readonly zone = inject(NgZone);
  private readonly platformId = inject(PLATFORM_ID);
  private observer?: IntersectionObserver;

  ngAfterViewInit(): void {
    const element = this.host.nativeElement;

    this.renderer.addClass(element, 'scroll-reveal');
    this.renderer.setStyle(element, '--scroll-reveal-delay', `${this.delay}ms`);
    this.renderer.setStyle(element, '--scroll-reveal-x', `${this.getHorizontalOffset()}px`);
    this.renderer.setStyle(element, '--scroll-reveal-y', `${this.getVerticalOffset()}px`);

    if (!isPlatformBrowser(this.platformId) || typeof IntersectionObserver === 'undefined') {
      this.renderer.addClass(element, 'is-visible');
      return;
    }

    this.zone.runOutsideAngular(() => {
      this.observer = new IntersectionObserver(
        entries => {
          if (entries.some(entry => entry.isIntersecting)) {
            this.zone.run(() => {
              this.renderer.addClass(element, 'is-visible');
              this.observer?.disconnect();
              this.observer = undefined;
            });
          }
        },
        {
          threshold: this.threshold,
          rootMargin: this.rootMargin,
        }
      );

      this.observer.observe(element);
    });
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }

  private getHorizontalOffset(): number {
    switch (this.direction) {
      case 'left':
        return -72;
      case 'right':
        return 72;
      default:
        return 0;
    }
  }

  private getVerticalOffset(): number {
    switch (this.direction) {
      case 'up':
        return 40;
      case 'down':
        return -40;
      default:
        return 18;
    }
  }
}
