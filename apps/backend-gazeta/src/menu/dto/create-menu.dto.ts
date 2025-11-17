import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsNumber, IsIn, MaxLength, MinLength, IsUrl } from 'class-validator';

export class CreateMenuDto {
  @ApiProperty({
    description: 'Ordem do menu',
    example: 1,
    minimum: 1,
    required: false,
    nullable: true
  })
  @IsOptional()
  @IsNumber({}, { message: 'Ordem deve ser um número' })
  order?: number | null;

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
    description: 'Tipo do menu (opcional). Se não informado, será inferido pelos campos slug/routerLink/externalLink. Para "submenu", não envie slug/routerLink/externalLink.',
    example: 'internal',
    enum: ['internal', 'external', 'category', 'submenu'],
    enumName: 'MenuType',
    required: false,
    examples: {
      internal: {
        value: 'internal',
        description: 'Para links internos da aplicação. Requer campo routerLink.'
      },
      external: {
        value: 'external', 
        description: 'Para links externos. Requer campo externalLink.'
      },
      category: {
        value: 'category',
        description: 'Para categorias de notícias. Requer campo slug.'
      },
      submenu: {
        value: 'submenu',
        description: 'Para itens agrupadores sem link. Não enviar slug/routerLink/externalLink.'
      }
    }
  })
  @IsOptional()
  @IsString({ message: 'Tipo deve ser uma string' })
  @IsIn(['internal', 'external', 'category', 'submenu'], { message: 'Tipo deve ser: internal, external, category ou submenu' })
  type?: string;

  @ApiProperty({
    description: 'Slug do menu - OBRIGATÓRIO para tipo "category". Usado para gerar URLs de categorias como /categoria/{slug}',
    example: 'tecnologia',
    required: false,
    maxLength: 255,
    examples: {
      technology: {
        value: 'tecnologia',
        description: 'Categoria de tecnologia'
      },
      sports: {
        value: 'esportes',
        description: 'Categoria de esportes'  
      },
      politics: {
        value: 'politica',
        description: 'Categoria de política'
      }
    }
  })
  @IsOptional()
  @IsString({ message: 'Slug deve ser uma string' })
  @MaxLength(255, { message: 'Slug deve ter no máximo 255 caracteres' })
  slug?: string;

  @ApiProperty({
    description: 'Link interno do router - OBRIGATÓRIO para tipo "internal". Usado para navegação interna da aplicação',
    example: '/sobre',
    required: false,
    maxLength: 500,
    examples: {
      home: {
        value: '/',
        description: 'Página inicial'
      },
      about: {
        value: '/sobre',
        description: 'Página sobre nós'
      },
      contact: {
        value: '/contato',
        description: 'Página de contato'
      }
    }
  })
  @IsOptional()
  @IsString({ message: 'Router link deve ser uma string' })
  @MaxLength(500, { message: 'Router link deve ter no máximo 500 caracteres' })
  routerLink?: string;

  @ApiProperty({
    description: 'Link externo - OBRIGATÓRIO para tipo "external". Deve ser uma URL válida completa',
    example: 'https://exemplo.com',
    required: false,
    maxLength: 500,
    examples: {
      website: {
        value: 'https://www.exemplo.com',
        description: 'Site externo completo'
      },
      social: {
        value: 'https://www.facebook.com/exemplo',
        description: 'Rede social'
      },
      partner: {
        value: 'https://www.parceiro.com.br',
        description: 'Site de parceiro'
      }
    }
  })
  @IsOptional()
  @IsString({ message: 'Link externo deve ser uma string' })
  @IsUrl({}, { message: 'Link externo deve ser uma URL válida' })
  @MaxLength(500, { message: 'Link externo deve ter no máximo 500 caracteres' })
  externalLink?: string;

  @ApiProperty({
    description: 'ID do menu pai - usado para criar submenus. Se informado, este menu será filho do menu especificado',
    example: 5,
    required: false,
    nullable: true
  })
  @IsOptional()
  @IsNumber({}, { message: 'Parent ID deve ser um número' })
  parentId?: number | null;
} 