import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { MaintenanceService } from '../service/maintenance.service';
import { firstValueFrom } from 'rxjs';

export const maintenanceGuard: CanActivateFn = async (route, state) => {
  const maintenanceService = inject(MaintenanceService);
  const router = inject(Router);

  try {
    const isMaintenanceActive = await firstValueFrom(
      maintenanceService.getMaintenanceStatus()
    );

    if (isMaintenanceActive) {
      // Redireciona para a página de manutenção
      router.navigate(['/maintenance']);
      return false;
    }

    // Se não está em manutenção, permite o acesso
    return true;
  } catch (error) {
    // Em caso de erro, permite o acesso (fail-open)
    console.error('Erro ao verificar status de manutenção:', error);
    return true;
  }
};

