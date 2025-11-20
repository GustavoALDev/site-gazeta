import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AlertComponent } from '@site-gazeta/alert';

@Component({
  imports: [RouterModule, AlertComponent],
  selector: 'app-root',
  template: `
    <router-outlet></router-outlet>
    <lib-alert></lib-alert>
  `
})

export class AppComponent {
  title = 'Painel Gazeta';
}
