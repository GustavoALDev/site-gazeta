import { ApiProperty } from '@nestjs/swagger';

export class MediaSizeResponseDto {
  @ApiProperty({ description: 'URL da imagem original', example: 'https://exemplo.com/original.jpg' })
  original: string;

  @ApiProperty({ description: 'URL da imagem pequena', example: 'https://exemplo.com/small.jpg' })
  small: string;

  @ApiProperty({ description: 'URL da imagem média', example: 'https://exemplo.com/medium.jpg' })
  medium: string;

  @ApiProperty({ description: 'URL da imagem super pequena', example: 'https://exemplo.com/super-small.jpg' })
  superSmall: string;
}

export class MediaResponseDto {
  @ApiProperty({ description: 'ID da mídia', example: 1 })
  id: number;

  @ApiProperty({ description: 'ID da postagem relacionada', example: 1 })
  postId: number;

  @ApiProperty({ description: 'Se a mídia é destaque', example: false })
  emphasis: boolean;

  @ApiProperty({ 
    description: 'Tamanhos da imagem', 
    required: false,
    type: [MediaSizeResponseDto]
  })
  imgSize?: MediaSizeResponseDto[];

  @ApiProperty({ description: 'Autor da mídia', example: 'João Fotógrafo', required: false })
  author?: string;

  @ApiProperty({ description: 'Data da mídia', example: '2025-01-20', required: false })
  date?: string;

  @ApiProperty({ description: 'Data de criação', example: '2025-01-20T10:00:00.000Z' })
  createdAt: string;

  @ApiProperty({ description: 'Data de atualização', example: '2025-01-20T10:00:00.000Z' })
  updatedAt: string;
} 