export class UploadAdapter {
  private loader: any;
  private apiUrl: string;
  private postId: number | string;

  constructor(loader: any, apiUrl: string, postId: number | string = 0) {
    this.loader = loader;
    this.apiUrl = apiUrl;
    this.postId = postId;
  }

  upload(): Promise<{ default: string }> {
    console.log('🖼️ [CKEditor Upload] Iniciando upload de imagem...');
    
    return this.loader.file.then(
      (file: File) =>
        new Promise((resolve, reject) => {
          console.log('📤 [CKEditor Upload] Arquivo detectado:', {
            name: file.name,
            size: `${(file.size / 1024).toFixed(2)} KB`,
            type: file.type
          });

          const formData = new FormData();
          formData.append('file', file);
          formData.append('postId', String(this.postId));
          formData.append('emphasis', 'false');

          console.log('📦 [CKEditor Upload] FormData preparado:', {
            postId: this.postId,
            emphasis: 'false',
            apiUrl: `${this.apiUrl}/media/upload`
          });

          const xhr = new XMLHttpRequest();
          
          xhr.open('POST', `${this.apiUrl}/media/upload`, true);
          xhr.responseType = 'json';
          
          console.log('🚀 [CKEditor Upload] Requisição aberta, enviando...');

          // Listener para progresso de upload (opcional)
          xhr.upload.addEventListener('progress', (evt) => {
            if (evt.lengthComputable) {
              this.loader.uploadTotal = evt.total;
              this.loader.uploaded = evt.loaded;
              const progress = ((evt.loaded / evt.total) * 100).toFixed(2);
              console.log(`📊 [CKEditor Upload] Progresso: ${progress}%`);
            }
          });

          // Listener para quando o upload é concluído
          xhr.addEventListener('load', () => {
            console.log(`✅ [CKEditor Upload] Requisição concluída! Status: ${xhr.status}`);
            
            if (xhr.status >= 200 && xhr.status < 300) {
              const response = xhr.response;
              console.log('📥 [CKEditor Upload] Resposta recebida:', response);
              
              // Ajuste aqui baseado na estrutura de resposta da sua API
              // A API retorna um objeto MediaResponseDto com imgSize contendo as URLs
              if (response && response.imgSize && response.imgSize.original) {
                const imageUrl = response.imgSize.original;
                console.log('🎉 [CKEditor Upload] URL da imagem obtida:', imageUrl);
                console.log('✨ [CKEditor Upload] Upload concluído com sucesso!');
                resolve({
                  default: imageUrl
                });
              } else {
                console.error('❌ [CKEditor Upload] Resposta inválida:', response);
                console.error('❌ [CKEditor Upload] Estrutura esperada: { imgSize: { original: "url" } }');
                reject('Resposta inválida do servidor');
              }
            } else {
              console.error('❌ [CKEditor Upload] Erro HTTP:', {
                status: xhr.status,
                statusText: xhr.statusText,
                response: xhr.response
              });
              reject(xhr.response?.message || 'Erro ao fazer upload da imagem');
            }
          });

          // Listener para erros
          xhr.addEventListener('error', () => {
            console.error('❌ [CKEditor Upload] Erro de rede!');
            console.error('❌ [CKEditor Upload] Verifique se o backend está rodando e se o CORS está configurado');
            reject('Erro de rede ao fazer upload da imagem');
          });

          // Listener para quando o upload é abortado
          xhr.addEventListener('abort', () => {
            console.warn('⚠️ [CKEditor Upload] Upload abortado pelo usuário');
            reject('Upload abortado');
          });

          // Envia a requisição
          console.log('📡 [CKEditor Upload] Enviando requisição para:', `${this.apiUrl}/media/upload`);
          xhr.send(formData);
        })
    );
  }

  abort(): void {
    // Implementar lógica de abort se necessário
  }
}

// Plugin factory para registrar o adaptador no CKEditor
export function createUploadAdapterPlugin(apiUrl: string, postId: number | string = 0) {
  console.log('🔌 [CKEditor Plugin] Criando plugin de upload com configurações:', {
    apiUrl,
    postId
  });
  
  return function UploadAdapterPlugin(editor: any): void {
    console.log('🔧 [CKEditor Plugin] Registrando adaptador de upload no FileRepository');
    
    try {
      editor.plugins.get('FileRepository').createUploadAdapter = (loader: any) => {
        console.log('📸 [CKEditor Plugin] Criando novo adaptador para upload');
        return new UploadAdapter(loader, apiUrl, postId);
      };
      console.log('✅ [CKEditor Plugin] Plugin de upload registrado com sucesso!');
    } catch (error) {
      console.error('❌ [CKEditor Plugin] Erro ao registrar plugin:', error);
    }
  };
}

