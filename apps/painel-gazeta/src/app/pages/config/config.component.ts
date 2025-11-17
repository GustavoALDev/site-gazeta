import { Component, signal } from '@angular/core';
import { SocialMediaComponent } from './social-media/social-media.component';
import { HomeConfigComponent } from './home-config/home-config.component';

@Component({
  selector: 'app-config',
  imports: [SocialMediaComponent, HomeConfigComponent],
  templateUrl: './config.component.html',
  styleUrl: './config.component.scss',
})
export class ConfigComponent {
  activeTab: 'social-media' | 'home-config' = 'social-media';

  setActiveTab(tab: 'social-media' | 'home-config') {
    this.activeTab = tab;
  }
}
