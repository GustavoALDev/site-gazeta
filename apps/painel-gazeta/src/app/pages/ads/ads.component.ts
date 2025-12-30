import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdsFormComponent } from './ads-form/ads-form.component';
import { Ads } from '@site-gazeta/models';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AdsService } from '../../core/services/ads.service';

@Component({
  selector: 'app-ads',
  standalone: true,
  imports: [CommonModule, AdsFormComponent, RouterModule],
  templateUrl: './ads.component.html',
  styleUrls: ['./ads.component.scss'],
})
export class AdsComponent implements OnInit {
  private activeRoute = inject(ActivatedRoute);
  private router = inject(Router);
  private adsService = inject(AdsService);

  // Signals
  adToEdit = signal<Ads | null>(null);
  isEdit = computed(() => !!this.adToEdit());
  adId: number | null = null;

  ngOnInit(): void {
    this.checkEdit();
  }

  async checkEdit() {
    return firstValueFrom(this.activeRoute.params)
      .then((param) => {
        const adId = param['id'];
        if (adId) {
          this.adId = Number(adId);
          
          firstValueFrom(this.adsService.getById(this.adId))
            .then((ad) => {
              this.adToEdit.set(ad);
            })
            .catch((error) => {
              console.error('Erro ao carregar anúncio:', error);
              this.router.navigate(['/adsList']);
            });
        }
      })
      .catch((error) => {
        console.error('Erro ao verificar parâmetros:', error);
      });
  }

  handleSubmit(): void {
    this.router.navigate(['/adsList']);
  }

  handleCancel(): void {
    this.router.navigate(['/adsList']);
  }
}
