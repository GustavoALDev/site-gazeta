import { Component, OnInit, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AlertComponent } from '@site-gazeta/alert';
import { ConfigService } from './core/services/config.service';
import { AlertService } from '@site-gazeta/alert';
import { first } from 'rxjs';

@Component({
  imports: [RouterModule, AlertComponent],
  selector: 'app-root',
  template: `
    <router-outlet></router-outlet>
    <lib-alert></lib-alert>
  `
})

export class AppComponent implements OnInit {
  private configService = inject(ConfigService);
  private alertService = inject(AlertService);

  ngOnInit(): void {
    this.checkMaintenanceStatus();
  }

  checkMaintenanceStatus(): void {
    this.configService.getMaintenance()
      .pipe(first())
      .subscribe({
        next: (config) => {
          if (config && config.isActive) {
            this.alertService.warning(
              'Site em Manutenção',
              'O site está atualmente fechado para manutenção. Os visitantes verão uma página de aviso.',
              10000 // 10 segundos
            );
          }
        },
        error: (error) => {
          // Silenciosamente ignora erros ao verificar manutenção
          console.error('Erro ao verificar status de manutenção:', error);
        }
      });
  }
}
