import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsNumber, IsBoolean, IsDateString } from 'class-validator';

export class CreateYoutubePlaylistDto {
  @ApiProperty({ 
    description: 'Título do vídeo', 
    example: 'Como funciona a energia solar' 
  })
  @IsNotEmpty({ message: 'Título é obrigatório' })
  @IsString({ message: 'Título deve ser uma string' })
  title: string;

  @ApiProperty({ 
    description: 'Descrição do vídeo', 
    example: 'Vídeo explicativo sobre energia solar e suas vantagens',
    required: false
  })
  @IsOptional()
  @IsString({ message: 'Descrição deve ser uma string' })
  description?: string;

  @ApiProperty({ 
    description: 'URL do vídeo do YouTube', 
    example: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' 
  })
  @IsNotEmpty({ message: 'URL do YouTube é obrigatória' })
  @IsString({ message: 'URL do YouTube deve ser uma string' })
  youtubeUrl: string;

  @ApiProperty({ 
    description: 'URL da thumbnail do vídeo', 
    example: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg' 
  })
  @IsNotEmpty({ message: 'Thumbnail é obrigatória' })
  @IsString({ message: 'Thumbnail deve ser uma string' })
  thumbnail: string;

  @ApiProperty({ 
    description: 'Duração do vídeo (formato MM:SS ou HH:MM:SS)', 
    example: '05:30',
    required: false
  })
  @IsOptional()
  @IsString({ message: 'Duração deve ser uma string' })
  duration?: string;

  @ApiProperty({ 
    description: 'ID do vídeo do YouTube', 
    example: 'dQw4w9WgXcQ' 
  })
  @IsNotEmpty({ message: 'ID do vídeo é obrigatório' })
  @IsString({ message: 'ID do vídeo deve ser uma string' })
  videoId: string;

  @ApiProperty({ 
    description: 'Ordem de exibição na playlist', 
    example: 1 
  })
  @IsNotEmpty({ message: 'Ordem de exibição é obrigatória' })
  @IsNumber({}, { message: 'Ordem de exibição deve ser um número' })
  displayOrder: number;

  @ApiProperty({ 
    description: 'Se o vídeo está ativo', 
    example: true,
    default: true
  })
  @IsOptional()
  @IsBoolean({ message: 'isActive deve ser um booleano' })
  isActive?: boolean;

  @ApiProperty({ 
    description: 'Se o vídeo está em destaque', 
    example: false,
    default: false
  })
  @IsOptional()
  @IsBoolean({ message: 'isEmphasis deve ser um booleano' })
  isEmphasis?: boolean;

  @ApiProperty({ 
    description: 'Data de publicação do vídeo no YouTube', 
    example: '2024-01-15T10:30:00Z',
    required: false
  })
  @IsOptional()
  @IsDateString({}, { message: 'Data de publicação deve estar em formato válido' })
  publishedAt?: string;
} 