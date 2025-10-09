import { Component } from '@angular/core';

@Component({
  selector: 'lib-footer',
  imports: [],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
})
export class FooterComponent {
  // Usando práticas modernas do Angular v20
  // Componente standalone sem necessidade de CommonModule
  // Se precisar adicionar funcionalidade futura, pode usar signals aqui
}
