import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsEnum, IsInt, IsArray } from 'class-validator';
import { Type, Transform } from 'class-transformer';
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

  @ApiProperty({
    description: 'Filtrar por ID(s) de categoria. Pode ser um único ID ou múltiplos IDs separados por vírgula',
    required: false,
    example: '1,2,3',
    type: String
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (!value) return undefined;
    if (typeof value === 'string') {
      return value.split(',').map(id => parseInt(id.trim(), 10)).filter(id => !isNaN(id));
    }
    if (Array.isArray(value)) {
      return value.map(id => typeof id === 'string' ? parseInt(id, 10) : id).filter(id => !isNaN(id));
    }
    return [parseInt(value, 10)].filter(id => !isNaN(id));
  })
  categoryId?: number[];
} 