import { ApiProperty } from '@nestjs/swagger';

export class CategoryDto {
  @ApiProperty({ description: 'ID da categoria', example: 1 })
  id: number;

  @ApiProperty({ description: 'Nome da categoria', example: 'Regional' })
  name: string;

  @ApiProperty({ description: 'Slug da categoria', example: 'regional' })
  slug: string;

  @ApiProperty({ description: 'Descrição da categoria', example: 'Notícias regionais', required: false })
  description?: string | null;

  @ApiProperty({ description: 'Cor da categoria', example: '#FF0000', required: false })
  color?: string | null;

  @ApiProperty({ description: 'Se a categoria está ativa', example: true })
  isActive: boolean;
}

export class VideoResponseDto {
  @ApiProperty({
    description: 'ID do vídeo',
    example: 1
  })
  id: number;

  @ApiProperty({
    description: 'Título do vídeo',
    example: 'Usina de Tucuruí 01'
  })
  title: string;

  @ApiProperty({
    description: 'URL do vídeo',
    example: 'http://localhost:3000/uploads/videos/video1.mp4'
  })
  url: string;

  @ApiProperty({
    description: 'URL do thumbnail (opcional)',
    example: 'http://localhost:3000/uploads/videos/video1_thumb.jpg',
    required: false
  })
  thumbnail?: string;

  @ApiProperty({
    description: 'Duração do vídeo',
    example: '01:51',
    required: false
  })
  duration?: string;

  @ApiProperty({
    description: 'Número de visualizações',
    example: 0,
    required: false
  })
  views?: number;

  @ApiProperty({
    description: 'Vídeo em destaque',
    example: false,
    required: false
  })
  featured?: boolean;

  @ApiProperty({
    description: 'Tags do vídeo',
    example: ['esporte', 'futebol'],
    required: false,
    type: [String]
  })
  tags?: string[];

  @ApiProperty({
    description: 'Categorias do vídeo',
    example: [],
    required: false,
    type: [CategoryDto]
  })
  categories?: CategoryDto[];

  @ApiProperty({
    description: 'Descrição do vídeo',
    example: 'Vídeo sobre a usina de Tucuruí',
    required: false
  })
  description?: string;

  @ApiProperty({
    description: 'Slug da notícia relacionada ao vídeo',
    example: 'usina-tucurui-01',
    required: false
  })
  newsSlug?: string;

  @ApiProperty({
    description: 'Data de criação',
    example: '2024-01-15T10:30:00.000Z'
  })
  createdAt: string;

  @ApiProperty({
    description: 'Data de atualização',
    example: '2024-01-15T10:30:00.000Z'
  })
  updatedAt: string;
}

