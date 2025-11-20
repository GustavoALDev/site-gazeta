import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertService, Toast } from '../alert.service';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'lib-alert',
  imports: [CommonModule],
  templateUrl: './alert.component.html',
  styleUrl: './alert.component.scss',
  animations: [
    trigger('toastAnimation', [
      transition(':enter', [
        style({ transform: 'translateX(100%)', opacity: 0 }),
        animate('300ms ease-out', style({ transform: 'translateX(0)', opacity: 1 }))
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ transform: 'translateX(100%)', opacity: 0 }))
      ])
    ])
  ]
})
export class AlertComponent {
  private alertService = inject(AlertService);
  
  toasts = this.alertService.toasts$;

  getIcon(type: Toast['type']): string {
    const icons = {
      success: 'check_circle',
      error: 'error',
      warning: 'warning',
      info: 'info'
    };
    return icons[type];
  }

  onClose(id: string): void {
    this.alertService.remove(id);
  }
}
