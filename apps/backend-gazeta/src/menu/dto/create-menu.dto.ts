import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsNumber, IsIn, MaxLength, MinLength, IsUrl } from 'class-validator';

export class CreateMenuDto {
  @ApiProperty({
    description: 'Ordem do menu',
    example: 1,
    minimum: 1
  })
  @IsNotEmpty({ message: 'Ordem é obrigatória' })
  @IsNumber({}, { message: 'Ordem deve ser um número' })
  order: number;

  @ApiProperty({
    description: 'Nome do menu',
    example: 'Início',
    minLength: 1,
    maxLength: 255
  })
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  @IsString({ message: 'Nome deve ser uma string' })
  @MinLength(1, { message: 'Nome deve ter no mínimo 1 caractere' })
  @MaxLength(255, { message: 'Nome deve ter no máximo 255 caracteres' })
  name: string;

  @ApiProperty({
    description: 'Tipo do menu',
    example: 'internal',
    enum: ['internal', 'external', 'category']
  })
  @IsNotEmpty({ message: 'Tipo é obrigatório' })
  @IsString({ message: 'Tipo deve ser uma string' })
  @IsIn(['internal', 'external', 'category'], { message: 'Tipo deve ser: internal, external ou category' })
  type: string;

  @ApiProperty({
    description: 'Slug do menu (usado para categorias)',
    example: 'tecnologia',
    required: false,
    maxLength: 255
  })
  @IsOptional()
  @IsString({ message: 'Slug deve ser uma string' })
  @MaxLength(255, { message: 'Slug deve ter no máximo 255 caracteres' })
  slug?: string;

  @ApiProperty({
    description: 'Link interno do router (usado para rotas internas)',
    example: '/sobre',
    required: false,
    maxLength: 500
  })
  @IsOptional()
  @IsString({ message: 'Router link deve ser uma string' })
  @MaxLength(500, { message: 'Router link deve ter no máximo 500 caracteres' })
  routerLink?: string;

  @ApiProperty({
    description: 'Link externo (usado para links externos)',
    example: 'https://exemplo.com',
    required: false,
    maxLength: 500
  })
  @IsOptional()
  @IsString({ message: 'Link externo deve ser uma string' })
  @IsUrl({}, { message: 'Link externo deve ser uma URL válida' })
  @MaxLength(500, { message: 'Link externo deve ter no máximo 500 caracteres' })
  externalLink?: string;
} 