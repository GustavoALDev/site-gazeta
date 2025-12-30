import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsArray, IsInt, ArrayMaxSize, ArrayMinSize, ValidateIf, IsEnum } from 'class-validator';

// Enum para o tipo de configuração
export enum TopCategoryType {
  PRIMARY = 'PRIMARY',
  SECONDARY = 'SECONDARY',
}

// DTO básico de categoria
export class CategoryBasicDto {
  @ApiProperty({ description: 'ID da categoria', example: 1 })
  id: number;

  @ApiProperty({ description: 'Nome da categoria', example: 'Regional' })
  name: string;

  @ApiProperty({ description: 'Slug da categoria', example: 'regional' })
  slug: string;

  @ApiProperty({ description: 'Descrição da categoria', example: 'Notícias regionais' })
  description?: string;

  @ApiProperty({ description: 'Cor da categoria', example: '#FF0000', required: false })
  color?: string;

  @ApiProperty({ description: 'Se a categoria está ativa', example: true })
  isActive: boolean;
}

// DTO para criar configuração de Top Categories
export class CreateTopCategoriesConfigDto {
  @ApiProperty({
    description: 'Tipo da configuração (PRIMARY ou SECONDARY)',
    enum: TopCategoryType,
    example: TopCategoryType.PRIMARY,
  })
  @IsEnum(TopCategoryType)
  type: TopCategoryType;

  @ApiProperty({
    description: 'Modo aleatório ativado (se true, não precisa selecionar categorias)',
    example: false,
  })
  @IsBoolean()
  randomMode: boolean;

  @ApiProperty({
    description: 'IDs das categorias selecionadas (exatamente 3, se randomMode = false)',
    example: [1, 2, 3],
    required: false,
  })
  @ValidateIf((o) => !o.randomMode)
  @IsArray()
  @ArrayMinSize(3, { message: 'Selecione exatamente 3 categorias' })
  @ArrayMaxSize(3, { message: 'Selecione exatamente 3 categorias' })
  @IsInt({ each: true })
  categoryIds?: number[];
}

// DTO para atualizar configuração de Top Categories
export class UpdateTopCategoriesConfigDto {
  @ApiProperty({
    description: 'Modo aleatório ativado',
    example: false,
    required: false,
  })
  @IsBoolean()
  randomMode?: boolean;

  @ApiProperty({
    description: 'IDs das categorias selecionadas (exatamente 3, se randomMode = false)',
    example: [1, 2, 3],
    required: false,
  })
  @ValidateIf((o) => o.randomMode === false)
  @IsArray()
  @ArrayMinSize(3, { message: 'Selecione exatamente 3 categorias' })
  @ArrayMaxSize(3, { message: 'Selecione exatamente 3 categorias' })
  @IsInt({ each: true })
  categoryIds?: number[];
}

// DTO de resposta
export class TopCategoriesConfigResponseDto {
  @ApiProperty({ description: 'ID da configuração', example: 1 })
  id: number;

  @ApiProperty({ 
    description: 'Tipo da configuração', 
    enum: TopCategoryType,
    example: TopCategoryType.PRIMARY 
  })
  type: TopCategoryType;

  @ApiProperty({ description: 'Modo aleatório ativo', example: false })
  randomMode: boolean;

  @ApiProperty({ 
    description: 'Categorias selecionadas', 
    type: [CategoryBasicDto],
    example: []
  })
  categories: CategoryBasicDto[];

  @ApiProperty({ description: 'IDs das categorias (para facilitar)', example: [1, 2, 3] })
  categoryIds: number[];

  @ApiProperty({ description: 'Data de criação', example: '2025-11-19T14:00:00.000Z' })
  createdAt: string;

  @ApiProperty({ description: 'Data de atualização', example: '2025-11-19T14:00:00.000Z' })
  updatedAt: string;

  @ApiProperty({ description: 'ID do usuário criador', example: 1 })
  createdBy: number;
}

// DTO de resposta combinada (primary + secondary)
export class TopCategoriesCombinedResponseDto {
  @ApiProperty({
    description: 'Configuração primária',
    type: TopCategoriesConfigResponseDto,
    nullable: true,
  })
  primary: TopCategoriesConfigResponseDto | null;

  @ApiProperty({
    description: 'Configuração secundária',
    type: TopCategoriesConfigResponseDto,
    nullable: true,
  })
  secondary: TopCategoriesConfigResponseDto | null;
}
