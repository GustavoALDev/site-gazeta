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
    description: 'Tipo do menu que determina qual campo de link será preenchido',
    example: 'internal',
    enum: ['internal', 'external', 'category'],
    enumName: 'MenuType'
  })
  type: string;

  @ApiProperty({
    description: 'Slug do menu - preenchido apenas para tipo "category"',
    example: 'tecnologia',
    required: false,
    nullable: true
  })
  slug?: string;

  @ApiProperty({
    description: 'Link interno do router - preenchido apenas para tipo "internal"',
    example: '/sobre',
    required: false,
    nullable: true
  })
  routerLink?: string;

  @ApiProperty({
    description: 'Link externo - preenchido apenas para tipo "external"',
    example: 'https://exemplo.com',
    required: false,
    nullable: true
  })
  externalLink?: string;

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