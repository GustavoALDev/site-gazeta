import { Component, forwardRef } from '@angular/core';

import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import * as CKBuilding from '../ckeditor/build/ckeditor';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';

@Component({
  selector: 'lib-text-editor',
  imports: [CKEditorModule, ReactiveFormsModule],
  template: `
    <ckeditor 
      tagName="textarea" 
      [editor]="editor"
      [data]="value"
      [formControl]="formControl"
      (blur)="onTouched()"
      
    ></ckeditor>
  `,
  styles:[
    `	
    textarea{
      min-height: 300px;
    }
    `
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextEditorComponent),
      multi: true
    }
  ]
})
export class TextEditorComponent implements ControlValueAccessor {
  protected editor = CKBuilding.default || CKBuilding;
  protected value = '';
  protected disable = false
  // Funções de callback do ControlValueAccessor
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private onChange = (value: string) => {};
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  protected onTouched = () => {};
  formControl = new FormControl('');
  constructor(){
    this.formControl.valueChanges.subscribe(value => {
      this.onChange(value as string)
    })
  }
  onDataChange(data: any): void {
    this.value = data as string;
    this.onChange(data);
  }
  
  onBlur(): void {
    this.onTouched();
  }
  
  
  writeValue(value: string): void {
    this.value = value || '';
  }
  
  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }
  
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  
  setDisabledState(isDisabled: boolean): void {
    if(isDisabled){
      this.formControl.disable();
    }else{
      this.formControl.enable();
    }
  }
}
