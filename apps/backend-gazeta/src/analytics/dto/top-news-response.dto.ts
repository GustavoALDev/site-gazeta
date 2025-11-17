import { ApiProperty } from '@nestjs/swagger';

export class TopNewsItemDto {
  @ApiProperty({ description: 'Título da notícia', example: 'Prefeitura anuncia obras' })
  title: string;

  @ApiProperty({ description: 'Slug da notícia', example: 'prefeitura-anuncia-obras' })
  slug: string;

  @ApiProperty({ description: 'Número de visualizações', example: 5420 })
  views: number;

  @ApiProperty({ description: 'Data do último acesso', example: '2024-01-15T14:30:00Z' })
  lastAccess: Date;
}

export class TopNewsResponseDto {
  @ApiProperty({ type: [TopNewsItemDto] })
  topNews: TopNewsItemDto[];
}

