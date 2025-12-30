export interface UploadVideoDto {
  title: string;
  duration?: string;
  categoryId?: number[];
  featured?: boolean;
  tags?: string[];
  description?: string;
  newsSlug?: string;
  removeThumbnail?: boolean; // Flag para remover thumbnail
}

