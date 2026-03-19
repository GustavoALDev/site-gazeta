import { Component, inject, OnInit, signal, ChangeDetectionStrategy } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '@site-gazeta/header';
import { FooterComponent } from '@site-gazeta/footer';
import { ApiService } from './core/service/api.service';
import { Ads, Menu } from '@site-gazeta/models';
@Component({
  imports: [RouterModule],
  selector: 'app-root',
  template: `
    <router-outlet></router-outlet>
  `,
  styles:[`
    :host{
      display: flex;
      flex-direction: column;
      height: 100%;
      width: 100%;
    }
  `],
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit{
  apiService = inject(ApiService);
  announcements = signal<Ads[]>([]);

  title = 'site-gazeta';
  ngOnInit(): void {
      // ApiService espera: getAdsByPositionAndPlacement(placement, position)
      // Endpoint: /advertisements/active/:placement/:position
      // Para header/top: placement='header', position='top'
      // this.getAdsbyPositionAndPlacement('header', 'top');
  }
  // getAdsbyPositionAndPlacement(placement: string, position: string){
  //   this.apiService.getAdsByPositionAndPlacement(placement, position).subscribe((ads) => {
  //     this.announcements.set(ads as Ads[]);
  //   });
  // }

}
