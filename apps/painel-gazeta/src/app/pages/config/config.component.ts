import { Component } from '@angular/core';
import { SocialMediaComponent } from './social-media/social-media.component';
import { HomeConfigComponent } from './home-config/home-config.component';
import { MaintenanceComponent } from './maintenance/maintenance.component';
import { MediaCleanupComponent } from './media-cleanup/media-cleanup.component';

@Component({
  selector: 'app-config',
  imports: [SocialMediaComponent, HomeConfigComponent, MaintenanceComponent, MediaCleanupComponent],
  templateUrl: './config.component.html',
  styleUrl: './config.component.scss',
})
export class ConfigComponent {
  activeTab: 'social-media' | 'home-config' | 'maintenance' | 'media-cleanup' = 'social-media';

  setActiveTab(tab: 'social-media' | 'home-config' | 'maintenance' | 'media-cleanup') {
    this.activeTab = tab;
  }
}
