import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as CKBuilding from '../ckeditor/build/ckeditor';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';

@Component({
  selector: 'lib-text-editor',
  imports: [CommonModule, CKEditorModule],
  template: `
  <ckeditor tagName="textarea" [editor]="editor" ></ckeditor>
  `
})
export class TextEditorComponent {
  editor = CKBuilding.default || CKBuilding;
}
