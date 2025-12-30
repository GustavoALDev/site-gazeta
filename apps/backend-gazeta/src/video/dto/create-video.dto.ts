import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, MaxLength } from 'class-validator';

export class CreateVideoDto {
  @ApiProperty({
    description: 'Título do vídeo',
    example: 'Usina de Tucuruí 01',
    maxLength: 255
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title: string;

  @ApiProperty({
    description: 'URL do vídeo (será preenchida automaticamente no upload)',
    example: 'videos/video1.mp4',
    required: false
  })
  @IsString()
  @IsOptional()
  url?: string;

  @ApiProperty({
    description: 'URL do thumbnail (opcional, pode ser enviada separadamente)',
    example: 'videos/video1.mp4',
    required: false
  })
  @IsString()
  @IsOptional()
  thumbnail?: string;

  @ApiProperty({
    description: 'Duração do vídeo no formato MM:SS ou HH:MM:SS',
    example: '01:51',
    required: false
  })
  @IsString()
  @IsOptional()
  @MaxLength(20)
  duration?: string;

  @ApiProperty({
    description: 'Descrição do vídeo',
    example: 'Vídeo sobre a usina de Tucuruí',
    required: false
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Slug da notícia relacionada ao vídeo',
    example: 'usina-tucurui-01',
    required: false
  })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  newsSlug?: string;
}

