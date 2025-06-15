import { ApiProperty } from '@nestjs/swagger';

export class NewsVideoResponseDto {
  @ApiProperty({ 
    description: 'ID do vídeo', 
    example: 1 
  })
  id: number;

  @ApiProperty({ 
    description: 'URL do vídeo', 
    example: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' 
  })
  url: string;

  @ApiProperty({ 
    description: 'URL da thumbnail do vídeo', 
    example: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg' 
  })
  thumbnail: string;

  @ApiProperty({ 
    description: 'ID da notícia relacionada', 
    example: 1 
  })
  newsId: number;

  @ApiProperty({ 
    description: 'Informações da notícia relacionada', 
    required: false 
  })
  news?: {
    id: number;
    title: string;
    slug: string;
  };
} 