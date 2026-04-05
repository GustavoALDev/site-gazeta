/**
 * Upload de vídeo para embutir no HTML da notícia (content-media).
 */
export interface ContentVideoUploadResult {
  url: string;
  mediaId?: number;
  sizeBytes?: number;
}

export function uploadContentVideoFile(file: File, apiUrl: string): Promise<ContentVideoUploadResult> {
  const url = `${apiUrl.replace(/\/$/, '')}/content-media/upload-video`;

  return new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append('file', file);

    const xhr = new XMLHttpRequest();
    xhr.open('POST', url, true);
    xhr.responseType = 'json';

    xhr.addEventListener('load', () => {
      const body = xhr.response;

      if (xhr.status >= 200 && xhr.status < 300) {
        if (body?.url) {
          resolve({
            url: body.url as string,
            mediaId: typeof body.mediaId === 'number' ? body.mediaId : undefined,
            sizeBytes: typeof body.sizeBytes === 'number' ? body.sizeBytes : undefined,
          });
        } else {
          reject(new Error('Resposta inválida do servidor (sem url)'));
        }
      } else {
        const msg =
          body?.message ||
          body?.error ||
          xhr.statusText ||
          `Erro HTTP ${xhr.status}`;
        reject(new Error(typeof msg === 'string' ? msg : 'Erro ao enviar vídeo'));
      }
    });

    xhr.addEventListener('error', () => {
      reject(new Error('Erro de rede ao enviar vídeo'));
    });
    xhr.addEventListener('abort', () => {
      reject(new Error('Upload cancelado'));
    });

    xhr.send(formData);
  });
}

export function escapeHtmlAttribute(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
