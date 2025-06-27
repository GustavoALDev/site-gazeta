import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';


@Component({
  selector: 'error-message',
  imports: [CommonModule],
  template: `
   <span [ngClass]="textAlign()">{{errorMessage()}}</span>
  `,
  styles: [
    `
      span {
        display: block;
        color: red;
        font-size: 0.875rem;
        margin-top: 0.25rem;
        height: 1rem;
        margin-bottom: 0.7rem;
      }
      .center {
        text-align: center;
      }
      .left {
        text-align: left;
      }
      .right {
        text-align: right;
      }
    `,
  ],
})
export class FormValidatorComponent {
  errorMessage = input<string>('');
  textAlign = input<'center' | 'left' | 'right'>('left');
}
