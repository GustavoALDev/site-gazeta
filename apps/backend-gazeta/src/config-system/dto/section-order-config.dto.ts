import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt, IsBoolean, IsOptional, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

// DTO para criar seção
export class CreateSectionOrderDto {
  @ApiProperty({
    description: 'Identificador único da seção',
    example: 'carousel',
    enum: ['carousel', 'videos', 'destaques', 'top-gazeta', 'cluster']
  })
  @IsString()
  sectionId: string;

  @ApiProperty({
    description: 'Nome da seção',
    example: 'Carrossel'
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Título exibido na seção',
    example: 'Últimas Notícias'
  })
  @IsString()
  title: string;

  @ApiProperty({
    description: 'Ordem de exibição',
    example: 1
  })
  @IsInt()
  order: number;

  @ApiProperty({
    description: 'Exibir o título',
    example: true
  })
  @IsBoolean()
  showTitle: boolean;

  @ApiProperty({
    description: 'Ícone material icons',
    example: 'view_carousel',
    required: false
  })
  @IsOptional()
  @IsString()
  icon?: string;
}

// DTO para atualizar seção
export class UpdateSectionOrderDto {
  @ApiProperty({
    description: 'Nome da seção',
    example: 'Carrossel',
    required: false
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    description: 'Título exibido na seção',
    example: 'Últimas Notícias',
    required: false
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({
    description: 'Ordem de exibição',
    example: 1,
    required: false
  })
  @IsOptional()
  @IsInt()
  order?: number;

  @ApiProperty({
    description: 'Exibir o título',
    example: true,
    required: false
  })
  @IsOptional()
  @IsBoolean()
  showTitle?: boolean;

  @ApiProperty({
    description: 'Ícone material icons',
    example: 'view_carousel',
    required: false
  })
  @IsOptional()
  @IsString()
  icon?: string;
}

// DTO para atualizar múltiplas seções (bulk update)
export class BulkUpdateSectionsDto {
  @ApiProperty({
    description: 'Array de seções com seus dados atualizados',
    type: [CreateSectionOrderDto],
    example: [
      { sectionId: 'carousel', name: 'Carrossel', title: 'Últimas Notícias', order: 1, showTitle: true, icon: 'view_carousel' },
      { sectionId: 'videos', name: 'Vídeos', title: 'Vídeos em Alta', order: 2, showTitle: true, icon: 'play_circle' }
    ]
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateSectionOrderDto)
  sections: CreateSectionOrderDto[];
}

// DTO de resposta
export class SectionOrderConfigResponseDto {
  @ApiProperty({ description: 'ID da configuração', example: 1 })
  id: number;

  @ApiProperty({ description: 'Identificador da seção', example: 'carousel' })
  sectionId: string;

  @ApiProperty({ description: 'Nome da seção', example: 'Carrossel' })
  name: string;

  @ApiProperty({ description: 'Título exibido', example: 'Últimas Notícias' })
  title: string;

  @ApiProperty({ description: 'Ordem de exibição', example: 1 })
  order: number;

  @ApiProperty({ description: 'Exibir título', example: true })
  showTitle: boolean;

  @ApiProperty({ description: 'Ícone', example: 'view_carousel' })
  icon?: string;

  @ApiProperty({ description: 'Data de criação', example: '2025-11-19T14:00:00.000Z' })
  createdAt: string;

  @ApiProperty({ description: 'Data de atualização', example: '2025-11-19T14:00:00.000Z' })
  updatedAt: string;

  @ApiProperty({ description: 'ID do usuário criador', example: 1 })
  createdBy: number;
}

// DTO de resposta em formato de mapa (objeto)
// Tipo Record para representar o mapa de seções
export type SectionOrderMapResponseDto = Record<string, SectionOrderConfigResponseDto>;

