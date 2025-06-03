import { ApiProperty } from '@nestjs/swagger';

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

  @ApiProperty({ description: 'URL da imagem de destaque', example: 'https://exemplo.com/imagem.jpg' })
  imgEmphasis: string;

  @ApiProperty({ description: 'Autor da imagem de destaque', example: 'João Fotógrafo' })
  imgEmphasisAuthor: string;

  @ApiProperty({ description: 'Nome do autor da notícia', example: 'Maria Silva' })
  author: string;

  @ApiProperty({ 
    description: 'Mídia adicional da notícia',
    example: { type: 'video', url: 'https://youtube.com/watch?v=123', author: 'Canal XYZ', date: '2025-01-20' }
  })
  media: { type: string; url: string; author: string; date: string };

  @ApiProperty({ description: 'Se a notícia está publicada', example: true })
  published: boolean;

  @ApiProperty({ description: 'Data de criação', example: '2025-01-20T10:00:00.000Z' })
  createdAt: string;

  @ApiProperty({ description: 'Data de atualização', example: '2025-01-20T10:00:00.000Z' })
  updatedAt: string;

  @ApiProperty({ description: 'Número de visualizações', example: 1250 })
  views: number;

  @ApiProperty({ description: 'Status da notícia', example: 'ATIVO' })
  status: string;

  @ApiProperty({ description: 'Validade da notícia', example: '2025-12-31' })
  validity: string;

  @ApiProperty({ description: 'Slug da notícia', example: 'nova-tecnologia-revoluciona-mercado' })
  slug: string;

  @ApiProperty({ description: 'Se a notícia é destaque', example: false })
  isEmphasis: boolean;
} 