import { Component, inject, OnInit, signal } from '@angular/core';
import { ApiConfigService } from '@site-gazeta/api';
import { toSignal } from '@angular/core/rxjs-interop';
import { firstValueFrom } from 'rxjs';
import { SocialMediaConfig } from '@site-gazeta/models';

@Component({
  selector: 'lib-footer',
  imports: [],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
})
export class FooterComponent implements OnInit {
  private apiService = inject(ApiConfigService);
  protected socialMidia = signal<SocialMediaConfig | null>(null);
  ngOnInit(): void {
    this.getSocialMedia();
  }
  async getSocialMedia() {
   this.socialMidia.set(await firstValueFrom(this.apiService.getSocialMedia()))
  }

  sendWhatsappMessenger(){
    if(!this.socialMidia()?.whatsapp) return;
    window.open(`https://wa.me/55${this.socialMidia()?.whatsapp}?text=Ol%C3%A1%2C%20quero%20comunicar%20um%20problema%20no%20site`, '_blank');
  }
}
