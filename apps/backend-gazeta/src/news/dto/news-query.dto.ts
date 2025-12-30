import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsEnum, IsBoolean, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { NewsStatus } from './news-status.enum';

export class NewsQueryDto {
  @ApiProperty({
    description: 'Filtrar por status da notícia (ACTIVE, INACTIVE ou TRASH). Se não fornecido, retorna apenas ACTIVE por padrão.',
    enum: NewsStatus,
    required: false,
    example: NewsStatus.ACTIVE
  })
  @IsOptional()
  @IsEnum(NewsStatus, { message: 'Status deve ser ACTIVE, INACTIVE ou TRASH' })
  status?: NewsStatus;

  @ApiProperty({
    description: 'Incluir itens do lixo na consulta. Se true, retorna todas as notícias independente do status. Ignorado se status for fornecido.',
    example: false,
    required: false,
    default: false,
    type: Boolean
  })
  @IsOptional()
  @IsBoolean({ message: 'includeTrash deve ser true ou false' })
  @Transform(({ value }) => {
    if (value === 'true' || value === true) return true;
    if (value === 'false' || value === false) return false;
    return undefined;
  })
  includeTrash?: boolean;

  @ApiProperty({
    description: 'IDs de notícias a serem excluídas do resultado (separados por vírgula). Útil para evitar duplicatas na mesma página.',
    example: '1,2,3',
    required: false,
    type: String
  })
  @IsOptional()
  @IsString()
  exclude?: string;
} 