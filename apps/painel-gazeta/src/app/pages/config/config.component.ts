import { Component, signal } from '@angular/core';
import { SocialMediaComponent } from './social-media/social-media.component';
import { HomeConfigComponent } from './home-config/home-config.component';
import { MaintenanceComponent } from './maintenance/maintenance.component';

@Component({
  selector: 'app-config',
  imports: [SocialMediaComponent, HomeConfigComponent, MaintenanceComponent],
  templateUrl: './config.component.html',
  styleUrl: './config.component.scss',
})
export class ConfigComponent {
  activeTab: 'social-media' | 'home-config' | 'maintenance' = 'social-media';

  setActiveTab(tab: 'social-media' | 'home-config' | 'maintenance') {
    this.activeTab = tab;
  }
}
