import { ApiProperty } from '@nestjs/swagger';

export class NewsMediaDto {
  @ApiProperty({ description: 'ID da mídia', example: 1, required: false })
  id?: number;

  @ApiProperty({ description: 'ID da notícia', example: 1, required: false })
  idNews?: number;

  @ApiProperty({ description: 'Se a mídia é destaque', example: false, required: false })
  emphasis?: boolean;

  @ApiProperty({ 
    description: 'Tamanhos da imagem', 
    required: false,
    example: [{
      original: 'https://exemplo.com/original.jpg',
      small: 'https://exemplo.com/small.jpg',
      medium: 'https://exemplo.com/medium.jpg',
      superSmall: 'https://exemplo.com/super-small.jpg'
    }]
  })
  imgSize?: Array<{
    original: string;
    small: string;
    medium: string;
    superSmall: string;
  }>;

  @ApiProperty({ description: 'Autor da mídia', example: 'João Fotógrafo', required: false })
  author?: string;

  @ApiProperty({ description: 'Data da mídia', example: '2025-01-20', required: false })
  date?: string;
}

export class NewsVideoDto {
  @ApiProperty({ description: 'ID do vídeo', example: 1, required: false })
  id?: number;

  @ApiProperty({ description: 'URL do vídeo', example: 'https://youtube.com/watch?v=123' })
  url: string;

  @ApiProperty({ description: 'Thumbnail do vídeo', example: 'https://exemplo.com/thumbnail.jpg' })
  thumbnail: string;
}

export class NewsResponseDto {
  @ApiProperty({ description: 'ID da notícia', example: 1 })
  id: number;

  @ApiProperty({ description: 'Título da notícia', example: 'Nova tecnologia revoluciona o mercado' })
  title: string;

  @ApiProperty({ description: 'Subtítulo da notícia', example: 'Inovação promete transformar a forma como trabalhamos' })
  subtitle: string;

  @ApiProperty({ description: 'Conteúdo completo da notícia' })
  content: string;

  @ApiProperty({ description: 'IDs das categorias', example: [1, 2, 3], type: [Number] })
  categoryId: number[];

  @ApiProperty({ description: 'Nome do autor da notícia', example: 'Maria Silva' })
  author: string;

  @ApiProperty({ 
    description: 'Mídias da notícia',
    type: [NewsMediaDto],
    isArray: true
  })
  mediaNews: NewsMediaDto[];

  @ApiProperty({ 
    description: 'Vídeos da notícia',
    type: [NewsVideoDto],
    isArray: true
  })
  videoNews: NewsVideoDto[];

  @ApiProperty({ description: 'Se a notícia está publicada', example: 'true' })
  published: string;

  @ApiProperty({ description: 'Data de criação', example: '2025-01-20T10:00:00.000Z' })
  createdAt: string;

  @ApiProperty({ description: 'Data de atualização', example: '2025-01-20T10:00:00.000Z' })
  updateAt: string;

  @ApiProperty({ description: 'Número de visualizações', example: 1250 })
  views: number;

  @ApiProperty({ description: 'Status da notícia', example: 'ATIVO' })
  status: string;

  @ApiProperty({ description: 'Validade da notícia', example: '2025-12-31', required: false })
  validity?: string;

  @ApiProperty({ description: 'Slug da notícia', example: 'nova-tecnologia-revoluciona-mercado' })
  slug: string;

  @ApiProperty({ description: 'Se a notícia é destaque', example: false })
  isEmphasis: boolean;
} 