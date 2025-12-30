/**
 * Sanitiza nomes de arquivos removendo acentos, espaços e caracteres especiais
 * Ex: "Captura de Tela (3).jpg" -> "captura_de_tela_3.jpg"
 */
export function sanitizeFileName(filename: string): string {
  // Separar nome e extensão
  const parsed = filename.split('.');
  const extension = parsed.length > 1 ? parsed.pop() : '';
  const nameWithoutExt = parsed.join('.');

  // Normalizar e remover acentos
  let sanitized = nameWithoutExt
    .normalize('NFD') // Decompõe caracteres acentuados
    .replace(/[\u0300-\u036f]/g, '') // Remove diacríticos (acentos)
    .toLowerCase(); // Converte para minúsculas

  // Substituir espaços e caracteres especiais por underscore
  sanitized = sanitized
    .replace(/\s+/g, '_') // Espaços -> underscore
    .replace(/[^a-z0-9._-]/g, '_') // Remove caracteres especiais (exceto ponto, hífen, underscore)
    .replace(/_{2,}/g, '_') // Remove underscores duplicados
    .replace(/^_+|_+$/g, ''); // Remove underscores no início e fim

  // Se ficou vazio, usar nome genérico
  if (!sanitized) {
    sanitized = 'arquivo';
  }

  // Limitar tamanho do nome (máximo 100 caracteres)
  if (sanitized.length > 100) {
    sanitized = sanitized.substring(0, 100);
  }

  // Retornar com extensão se houver
  return extension ? `${sanitized}.${extension}` : sanitized;
}

