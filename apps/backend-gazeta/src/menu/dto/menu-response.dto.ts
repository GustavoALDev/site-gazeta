import { ApiProperty } from '@nestjs/swagger';

export class MenuResponseDto {
  @ApiProperty({
    description: 'ID do menu',
    example: 1
  })
  id: number;

  @ApiProperty({
    description: 'Ordem do menu',
    example: 1
  })
  order: number;

  @ApiProperty({
    description: 'Nome do menu',
    example: 'Início'
  })
  name: string;

  @ApiProperty({
    description: 'Tipo do menu',
    example: 'internal',
    enum: ['internal', 'external', 'category']
  })
  type: string;

  @ApiProperty({
    description: 'Slug do menu (usado para categorias)',
    example: 'tecnologia',
    required: false
  })
  slug?: string;

  @ApiProperty({
    description: 'Link interno do router (usado para rotas internas)',
    example: '/sobre',
    required: false
  })
  routerLink?: string;

  @ApiProperty({
    description: 'Link externo (usado para links externos)',
    example: 'https://exemplo.com',
    required: false
  })
  externalLink?: string;

  @ApiProperty({
    description: 'Indica se o menu está ativo',
    example: true
  })
  isActive: boolean;

  @ApiProperty({
    description: 'Data de criação',
    example: '2023-12-01T10:00:00Z'
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Data da última atualização',
    example: '2023-12-01T10:00:00Z'
  })
  updatedAt: Date;
} 