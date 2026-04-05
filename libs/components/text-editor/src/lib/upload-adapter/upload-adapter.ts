export class UploadAdapter {
  private loader: any;
  private apiUrl: string;

  constructor(loader: any, apiUrl: string) {
    this.loader = loader;
    this.apiUrl = apiUrl;
  }

  upload(): Promise<{ default: string }> {
    return this.loader.file.then(
      (file: File) =>
        new Promise((resolve, reject) => {
          const formData = new FormData();
          formData.append('file', file);

          const xhr = new XMLHttpRequest();

          xhr.open('POST', `${this.apiUrl}/content-media/upload`, true);
          xhr.responseType = 'json';

          xhr.upload.addEventListener('progress', (evt) => {
            if (evt.lengthComputable) {
              this.loader.uploadTotal = evt.total;
              this.loader.uploaded = evt.loaded;
            }
          });

          xhr.addEventListener('load', () => {
            if (xhr.status >= 200 && xhr.status < 300) {
              const response = xhr.response;

              if (response && response.url) {
                resolve({
                  default: response.url,
                });
              } else {
                reject('Resposta inválida do servidor');
              }
            } else {
              reject(xhr.response?.message || 'Erro ao fazer upload da imagem');
            }
          });

          xhr.addEventListener('error', () => {
            reject('Erro de rede ao fazer upload da imagem');
          });

          xhr.addEventListener('abort', () => {
            reject('Upload abortado');
          });

          xhr.send(formData);
        })
    );
  }

  abort(): void {
    // Implementar lógica de abort se necessário
  }
}

export function createUploadAdapterPlugin(apiUrl: string) {
  return function UploadAdapterPlugin(editor: any): void {
    try {
      editor.plugins.get('FileRepository').createUploadAdapter = (loader: any) => {
        return new UploadAdapter(loader, apiUrl);
      };
    } catch {
      /* FileRepository indisponível neste build */
    }
  };
}
