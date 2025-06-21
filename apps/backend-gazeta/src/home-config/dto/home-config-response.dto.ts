import { ApiProperty } from '@nestjs/swagger';

export class CategoryInfoDto {
  @ApiProperty({ description: 'ID da categoria', example: 1 })
  id: number;

  @ApiProperty({ description: 'Nome da categoria', example: 'Regional' })
  name: string;

  @ApiProperty({ description: 'Slug da categoria', example: 'regional' })
  slug: string;

  @ApiProperty({ description: 'Descrição da categoria', example: 'Notícias da região' })
  description?: string;

  @ApiProperty({ description: 'Se a categoria está ativa', example: true })
  isActive: boolean;
}

export class HomeCategoryConfigResponseDto {
  @ApiProperty({ description: 'ID da configuração', example: 1 })
  id: number;

  @ApiProperty({ description: 'ID da categoria', example: 1 })
  categoryId: number;

  @ApiProperty({ description: 'Ordem de exibição', example: 1 })
  displayOrder: number;

  @ApiProperty({ description: 'Se está visível na home', example: true })
  isVisible: boolean;

  @ApiProperty({ description: 'Máximo de notícias a exibir', example: 6 })
  maxNews: number;

  @ApiProperty({ description: 'Se mostra o título da categoria', example: true })
  showTitle: boolean;

  @ApiProperty({ description: 'Título personalizado', example: 'Notícias Regionais', required: false })
  customTitle?: string;

  @ApiProperty({ description: 'Data de criação', example: '2025-01-20T10:00:00.000Z' })
  createdAt: string;

  @ApiProperty({ description: 'Data de atualização', example: '2025-01-20T10:00:00.000Z' })
  updatedAt: string;

  @ApiProperty({ description: 'ID do usuário criador', example: 1 })
  createdBy: number;

  @ApiProperty({ description: 'Nome do usuário criador', example: 'João Silva' })
  creatorName: string;

  @ApiProperty({ description: 'Informações da categoria', type: CategoryInfoDto })
  category: CategoryInfoDto;
}

export class HomeConfigOrderDto {
  @ApiProperty({ description: 'ID da configuração', example: 1 })
  id: number;

  @ApiProperty({ description: 'Nova ordem de exibição', example: 2 })
  displayOrder: number;
} 