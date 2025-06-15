import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsNumber } from 'class-validator';

export class CreateNewsVideoDto {
  @ApiProperty({ 
    description: 'URL do vídeo', 
    example: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' 
  })
  @IsNotEmpty({ message: 'URL do vídeo é obrigatória' })
  @IsString({ message: 'URL do vídeo deve ser uma string' })
  url: string;

  @ApiProperty({ 
    description: 'URL da thumbnail do vídeo', 
    example: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg' 
  })
  @IsNotEmpty({ message: 'Thumbnail do vídeo é obrigatória' })
  @IsString({ message: 'Thumbnail do vídeo deve ser uma string' })
  thumbnail: string;

  @ApiProperty({ 
    description: 'ID da notícia relacionada', 
    example: 1 
  })
  @IsNotEmpty({ message: 'ID da notícia é obrigatório' })
  @IsNumber({}, { message: 'ID da notícia deve ser um número' })
  newsId: number;
} 