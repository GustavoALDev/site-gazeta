import { Component, forwardRef, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';

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
export class TextEditorComponent implements ControlValueAccessor, OnInit, OnDestroy {
  @Input() apiUrl: string = 'https://gazetadopara.com/api'; // URL padrão, pode ser sobrescrita
  @Input() resetFormControl: any;
  @Input() newsId?: number; // ID da notícia (se definido, indica que a notícia foi salva e não devemos deletar imagens)
  @Output() ready = new EventEmitter<any>();
  protected editor = CKBuilding.default || CKBuilding;
  protected value = '';
  protected disable = false
  protected editorConfig: any = {};
  private editorInstance: any = null;
  private previousImageUrls: string[] = [];
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
    
    this.editorInstance = editor;
    
    try {
      // Registra o adaptador de upload quando o editor estiver pronto
      editor.plugins.get('FileRepository').createUploadAdapter = (loader: any) => {
        console.log('📸 [CKEditor Plugin] Criando novo adaptador para upload');
        return new UploadAdapter(loader, this.apiUrl);
      };
      
      // Monitorar mudanças no conteúdo para detectar imagens removidas
      editor.model.document.on('change:data', () => {
        this.detectRemovedImages();
      });
      
      // Inicializar lista de URLs de imagens
      this.updateImageUrls();
      
      console.log('✅ [TextEditor] Upload adapter configurado com sucesso!');
    } catch (error) {
      console.error('❌ [TextEditor] Erro ao configurar upload adapter:', error);
    }
  }
  
  /**
   * Extrai URLs de imagens do HTML
   */
  private extractImageUrls(html: string): string[] {
    if (!html) return [];
    
    const regex = /<img[^>]+src=["']([^"']+)["']/gi;
    const urls: string[] = [];
    let match;
    
    while ((match = regex.exec(html)) !== null) {
      const url = match[1].trim();
      // Filtrar apenas URLs que são do nosso domínio (uploads/)
      if (url.includes('/uploads/')) {
        urls.push(url);
      }
    }
    
    return [...new Set(urls)]; // Remover duplicatas
  }
  
  /**
   * Atualiza a lista de URLs de imagens do conteúdo atual
   */
  private updateImageUrls(): void {
    if (this.editorInstance) {
      const html = this.editorInstance.getData();
      this.previousImageUrls = this.extractImageUrls(html);
    }
  }
  
  /**
   * Detecta imagens removidas e as deleta do servidor
   */
  private detectRemovedImages(): void {
    if (!this.editorInstance) return;
    
    const currentHtml = this.editorInstance.getData();
    const currentImageUrls = this.extractImageUrls(currentHtml);
    
    // Encontrar URLs que estavam antes mas não estão mais
    const removedUrls = this.previousImageUrls.filter(url => !currentImageUrls.includes(url));
    
    // Deletar imagens removidas do servidor
    if (removedUrls.length > 0) {
      console.log('🗑️ [TextEditor] Imagens removidas detectadas:', removedUrls);
      
      removedUrls.forEach(url => {
        this.deleteImageFromServer(url).catch(error => {
          console.error(`❌ [TextEditor] Erro ao deletar imagem ${url}:`, error);
        });
      });
    }
    
    // Atualizar lista de URLs
    this.previousImageUrls = currentImageUrls;
  }
  
  /**
   * Deleta imagem do servidor
   */
  private async deleteImageFromServer(url: string): Promise<void> {
    try {
      const response = await fetch(`${this.apiUrl}/content-media`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ url })
      });
      
      if (response.ok) {
        console.log(`✅ [TextEditor] Imagem deletada do servidor: ${url}`);
      } else {
        const error = await response.json();
        console.error(`❌ [TextEditor] Erro ao deletar imagem:`, error);
      }
    } catch (error) {
      console.error(`❌ [TextEditor] Erro de rede ao deletar imagem:`, error);
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
    // Atualizar lista de URLs quando o valor é definido externamente
    if (this.editorInstance) {
      setTimeout(() => {
        this.updateImageUrls();
      }, 100);
    }
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

  /**
   * Limpa imagens não utilizadas quando o componente é destruído
   * Só deleta imagens se a notícia não foi salva (newsId não definido)
   */
  ngOnDestroy(): void {
    // Se newsId está definido, a notícia foi salva e as imagens já estão associadas
    // Não precisamos deletar nada
    if (this.newsId) {
      console.log(`✅ [TextEditor] Notícia ${this.newsId} já foi salva, mantendo imagens no servidor`);
      return;
    }

    console.log('🧹 [TextEditor] Componente sendo destruído, limpando imagens não utilizadas...');
    
    // Extrair todas as URLs de imagens do conteúdo atual
    if (this.editorInstance) {
      try {
        const html = this.editorInstance.getData();
        const imageUrls = this.extractImageUrls(html);
        
        if (imageUrls.length > 0) {
          console.log(`🗑️ [TextEditor] Deletando ${imageUrls.length} imagem(ns) não associadas a notícia:`, imageUrls);
          
          // Deletar todas as imagens do servidor (não bloqueia a destruição do componente)
          imageUrls.forEach(url => {
            this.deleteImageFromServer(url).catch(error => {
              console.error(`❌ [TextEditor] Erro ao deletar imagem ${url} no OnDestroy:`, error);
            });
          });
        } else {
          console.log('✅ [TextEditor] Nenhuma imagem para deletar');
        }
      } catch (error) {
        console.error('❌ [TextEditor] Erro ao extrair imagens no OnDestroy:', error);
      }
    }
  }
}
