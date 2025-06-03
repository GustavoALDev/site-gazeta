import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsArray, IsBoolean, IsOptional, IsObject, MinLength, MaxLength } from 'class-validator';

export class CreateNewsDto {
  @ApiProperty({
    description: 'Título da notícia',
    example: 'Nova tecnologia revoluciona o mercado',
    minLength: 5,
    maxLength: 255
  })
  @IsNotEmpty({ message: 'Título é obrigatório' })
  @IsString({ message: 'Título deve ser uma string' })
  @MinLength(5, { message: 'Título deve ter no mínimo 5 caracteres' })
  @MaxLength(255, { message: 'Título deve ter no máximo 255 caracteres' })
  title: string;

  @ApiProperty({
    description: 'Subtítulo/resumo da notícia',
    example: 'Inovação promete transformar a forma como trabalhamos'
  })
  @IsNotEmpty({ message: 'Subtítulo é obrigatório' })
  @IsString({ message: 'Subtítulo deve ser uma string' })
  subtitle: string;

  @ApiProperty({
    description: 'Conteúdo completo da notícia',
    example: 'O conteúdo completo da notícia com todos os detalhes...'
  })
  @IsNotEmpty({ message: 'Conteúdo é obrigatório' })
  @IsString({ message: 'Conteúdo deve ser uma string' })
  content: string;

  @ApiProperty({
    description: 'IDs das categorias',
    example: [1, 2, 3],
    type: [Number]
  })
  @IsArray({ message: 'categoryId deve ser um array' })
  @IsNotEmpty({ message: 'Pelo menos uma categoria é obrigatória' })
  categoryId: number[];

  @ApiProperty({
    description: 'URL da imagem de destaque',
    example: 'https://exemplo.com/imagem.jpg'
  })
  @IsNotEmpty({ message: 'Imagem de destaque é obrigatória' })
  @IsString({ message: 'URL da imagem deve ser uma string' })
  imgEmphasis: string;

  @ApiProperty({
    description: 'Autor da imagem de destaque',
    example: 'João Fotógrafo'
  })
  @IsNotEmpty({ message: 'Autor da imagem é obrigatório' })
  @IsString({ message: 'Autor da imagem deve ser uma string' })
  imgEmphasisAuthor: string;

  @ApiProperty({
    description: 'Nome do autor da notícia',
    example: 'Maria Silva'
  })
  @IsNotEmpty({ message: 'Autor é obrigatório' })
  @IsString({ message: 'Autor deve ser uma string' })
  author: string;

  @ApiProperty({
    description: 'Mídia adicional da notícia',
    example: { type: 'video', url: 'https://youtube.com/watch?v=123', author: 'Canal XYZ', date: '2025-01-20' }
  })
  @IsObject({ message: 'Media deve ser um objeto' })
  media: { type: string; url: string; author: string; date: string };

  @ApiProperty({
    description: 'Se a notícia está publicada',
    example: true,
    default: false
  })
  @IsOptional()
  @IsBoolean({ message: 'Published deve ser um boolean' })
  published?: boolean;

  @ApiProperty({
    description: 'Status da notícia',
    example: 'ATIVO'
  })
  @IsNotEmpty({ message: 'Status é obrigatório' })
  @IsString({ message: 'Status deve ser uma string' })
  status: string;

  @ApiProperty({
    description: 'Validade da notícia',
    example: '2025-12-31'
  })
  @IsNotEmpty({ message: 'Validade é obrigatória' })
  @IsString({ message: 'Validade deve ser uma string' })
  validity: string;

  @ApiProperty({
    description: 'Slug da notícia',
    example: 'nova-tecnologia-revoluciona-mercado'
  })
  @IsNotEmpty({ message: 'Slug é obrigatório' })
  @IsString({ message: 'Slug deve ser uma string' })
  slug: string;

  @ApiProperty({
    description: 'Se a notícia é destaque',
    example: false,
    default: false
  })
  @IsOptional()
  @IsBoolean({ message: 'isEmphasis deve ser um boolean' })
  isEmphasis?: boolean;
} 