import { ApiProperty } from '@nestjs/swagger';

export class YoutubePlaylistResponseDto {
  @ApiProperty({ description: 'ID do vídeo', example: 1 })
  id: number;

  @ApiProperty({ description: 'Título do vídeo', example: 'Como funciona a energia solar' })
  title: string;

  @ApiProperty({ 
    description: 'Descrição do vídeo', 
    example: 'Vídeo explicativo sobre energia solar e suas vantagens',
    nullable: true
  })
  description: string | null;

  @ApiProperty({ 
    description: 'URL do vídeo do YouTube', 
    example: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' 
  })
  youtubeUrl: string;

  @ApiProperty({ 
    description: 'URL da thumbnail do vídeo', 
    example: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg' 
  })
  thumbnail: string;

  @ApiProperty({ 
    description: 'Duração do vídeo', 
    example: '05:30',
    nullable: true
  })
  duration: string | null;

  @ApiProperty({ 
    description: 'ID do vídeo do YouTube', 
    example: 'dQw4w9WgXcQ' 
  })
  videoId: string;

  @ApiProperty({ description: 'Ordem de exibição na playlist', example: 1 })
  displayOrder: number;

  @ApiProperty({ description: 'Se o vídeo está ativo', example: true })
  isActive: boolean;

  @ApiProperty({ description: 'Se o vídeo está em destaque', example: false })
  isEmphasis: boolean;

  @ApiProperty({ 
    description: 'Data de publicação do vídeo no YouTube', 
    example: '2024-01-15T10:30:00Z',
    nullable: true
  })
  publishedAt: Date | null;

  @ApiProperty({ description: 'Data de criação', example: '2024-01-10T08:00:00Z' })
  createdAt: Date;

  @ApiProperty({ description: 'Data de atualização', example: '2024-01-10T08:00:00Z' })
  updatedAt: Date;

  @ApiProperty({ description: 'ID do usuário que criou', example: 1 })
  createdBy: number;

  @ApiProperty({ description: 'Informações do criador', nullable: true })
  creator?: {
    id: number;
    name: string;
    email: string;
  };
} 