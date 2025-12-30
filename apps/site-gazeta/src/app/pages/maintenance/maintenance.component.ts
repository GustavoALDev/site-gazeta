import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaintenanceService } from '../../core/service/maintenance.service';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-maintenance',
  imports: [CommonModule],
  templateUrl: './maintenance.component.html',
  styleUrl: './maintenance.component.scss',
})
export class MaintenanceComponent implements OnInit {
  private maintenanceService = inject(MaintenanceService);
  private router = inject(Router);

  isLoading = true;
  isMaintenanceActive = false;

  ngOnInit(): void {
    this.checkMaintenanceStatus();
  }

  async checkMaintenanceStatus(): Promise<void> {
    try {
      this.isMaintenanceActive = await firstValueFrom(
        this.maintenanceService.getMaintenanceStatus()
      );

      // Se não estiver mais em manutenção, redireciona para home
      if (!this.isMaintenanceActive) {
        this.router.navigate(['/']);
      }
    } catch (error) {
      console.error('Erro ao verificar status de manutenção:', error);
      // Em caso de erro, assume que não está em manutenção e redireciona
      this.router.navigate(['/']);
    } finally {
      this.isLoading = false;
    }
  }

  retry(): void {
    this.isLoading = true;
    this.checkMaintenanceStatus();
  }
}

