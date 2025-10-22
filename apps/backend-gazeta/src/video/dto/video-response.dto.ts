import { ApiProperty } from '@nestjs/swagger';

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

