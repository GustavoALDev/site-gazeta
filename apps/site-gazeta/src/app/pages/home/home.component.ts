import { Component, computed, effect, inject, OnInit, signal, ChangeDetectionStrategy } from '@angular/core';
import { MenuComponent } from '@site-gazeta/menu';
import { Ads, HomeData, Menu, SectionOrderConfigMap } from '@site-gazeta/models';
import { ApiService } from '../../core/service/api.service';
import { AnalyticsService } from '../../core/service/analytics.service';
import { SessionService } from '../../core/service/session.service';
import { NewsSearchComponent } from '../news-search/news-search.component';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { HeaderComponent } from '@site-gazeta/header';
import { FooterComponent } from '@site-gazeta/footer';

@Component({
  selector: 'app-home',
  imports: [
    RouterModule,
    MenuComponent,
    NewsSearchComponent,
    HeaderComponent,
    FooterComponent
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection:ChangeDetectionStrategy.OnPush
})

export class HomeComponent implements OnInit{
  private apiService = inject(ApiService);
  private analyticsService = inject(AnalyticsService);
  private sessionService = inject(SessionService);
  private route = inject(ActivatedRoute);
  menuItems = signal<Menu[]>([]);
  searchActive = signal<boolean>(false);
  searchQuery = signal<string>('');
  headerAds = signal<Ads[]>([]);
  ngOnInit(): void {
    this.getMenu();
    this.getAds();
    this.trackPageView();
  }
  getAds(): void {
    this.apiService.getAdsByPositionAndPlacement('header', 'top')
      .subscribe(ads => {
        console.log(ads);
        this.headerAds.set(ads);
      });
  }

  
  getMenu(){
    this.apiService.getMenu().subscribe((menu) => {
      this.menuItems.set(menu as Menu[]);
    });
  }

  private trackPageView(): void {
    const sessionId = this.sessionService.getSessionId();
    this.analyticsService.trackPageView('/', sessionId).subscribe({
      next: () => console.log('✅ Home page view tracked'),
      error: (err) => console.warn('⚠️ Failed to track home page:', err)
    });
  }
}
