import { Component, forwardRef, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import * as CKBuilding from '../ckeditor/build/ckeditor';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { UploadAdapter } from '../upload-adapter/upload-adapter';

@Component({
  selector: 'lib-text-editor',
  imports: [CKEditorModule, ReactiveFormsModule],
  template: `
    <ckeditor 
      tagName="textarea" 
      [editor]="editor"
      [config]="editorConfig"
      [data]="value"
      [formControl]="formControl"
      (ready)="onReady($event)"
      (blur)="onTouched()"
      (ready)="onReady($event)"
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
export class TextEditorComponent implements ControlValueAccessor, OnInit {
  @Input() apiUrl: string = 'https://gazetadopara.com/api'; // URL padrão, pode ser sobrescrita
  @Input() postId: number | string = 0; // ID da postagem, usado para associar uploads
  @Input() resetFormControl: any;
  @Output() ready = new EventEmitter<any>();
  protected editor = CKBuilding.default || CKBuilding;
  protected value = '';
  protected disable = false
  protected editorConfig: any = {};
  // Funções de callback do ControlValueAccessor
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private onChange = (value: string) => {};
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  protected onTouched = () => {};
  formControl = new FormControl('');
  
  ngOnInit(): void {
    this.formControl.valueChanges.subscribe(value => {
      this.onChange(value as string)
    })
    
    console.log('✅ [TextEditor] Componente inicializado!');
  }

  onReady(editor: any): void {  
    console.log('🔧 [TextEditor] Editor pronto, configurando upload adapter...');
    
    try {
      // Registra o adaptador de upload quando o editor estiver pronto
      editor.plugins.get('FileRepository').createUploadAdapter = (loader: any) => {
        console.log('📸 [CKEditor Plugin] Criando novo adaptador para upload');
        return new UploadAdapter(loader, this.apiUrl, this.postId);
      };
      
      console.log('✅ [TextEditor] Upload adapter configurado com sucesso!');
    } catch (error) {
      console.error('❌ [TextEditor] Erro ao configurar upload adapter:', error);
    }
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
