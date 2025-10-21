import { ApiProperty } from '@nestjs/swagger';

export class CategoryResponseDto {
  @ApiProperty({
    description: 'ID da categoria',
    example: 1
  })
  id: number;

  @ApiProperty({
    description: 'Nome da categoria',
    example: 'Tecnologia'
  })
  name: string;

  @ApiProperty({
    description: 'Descrição da categoria',
    example: 'Notícias sobre tecnologia, inovação e startups',
    nullable: true
  })
  description: string | null;

  @ApiProperty({
    description: 'Slug da categoria',
    example: 'tecnologia'
  })
  slug: string;

  @ApiProperty({
    description: 'Cor identificadora da categoria',
    example: '#FF5733',
    nullable: true
  })
  color: string | null;

  @ApiProperty({
    description: 'Status da categoria',
    example: true
  })
  isActive: boolean;

  @ApiProperty({
    description: 'Data de criação',
    example: '2025-01-20T10:00:00.000Z'
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Data de atualização',
    example: '2025-01-20T10:00:00.000Z'
  })
  updatedAt: Date;
} 