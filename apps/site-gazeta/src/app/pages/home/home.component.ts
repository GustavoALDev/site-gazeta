import { Component, computed, effect, inject, OnInit, signal } from '@angular/core';
import { MenuComponent } from '@site-gazeta/menu';
import { Menu, SectionOrderConfigMap } from '@site-gazeta/models';
import { ApiService } from '../../core/service/api.service';
import { AnalyticsService } from '../../core/service/analytics.service';
import { SessionService } from '../../core/service/session.service';
import { NewsSearchComponent } from '../news-search/news-search.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [
    RouterModule,
    MenuComponent,
    NewsSearchComponent
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})

export class HomeComponent implements OnInit{
  private apiService = inject(ApiService);
  private analyticsService = inject(AnalyticsService);
  private sessionService = inject(SessionService);
  menuItems = signal<Menu[]>([]);
  searchActive = signal<boolean>(false);
  searchQuery = signal<string>('');
  ngOnInit(): void {
    this.getMenu();
    this.trackPageView();
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
