import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '@site-gazeta/header';
import { FooterComponent } from '@site-gazeta/footer';
@Component({
  imports: [RouterModule,HeaderComponent, FooterComponent],
  selector: 'app-root',
  template: `
    <lib-header></lib-header>
    <router-outlet></router-outlet>
    <lib-footer></lib-footer>
  `,
  styles:[`
    :host{
      display: flex;
      flex-direction: column;
      height: 100%;
      width: 100%;
    }
  `]
})
export class AppComponent {
  title = 'site-gazeta';
}
