import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsEnum } from 'class-validator';
import { NewsStatus } from './news-status.enum';

export class NewsQueryDto {
  @ApiProperty({
    description: 'Filtrar por status da notícia',
    enum: NewsStatus,
    required: false,
    example: NewsStatus.ACTIVE
  })
  @IsOptional()
  @IsEnum(NewsStatus, { message: 'Status deve ser ACTIVE, INACTIVE ou TRASH' })
  status?: NewsStatus;

  @ApiProperty({
    description: 'Incluir itens do lixo na consulta',
    example: false,
    required: false,
    default: false
  })
  @IsOptional()
  includeTrash?: boolean;
} 