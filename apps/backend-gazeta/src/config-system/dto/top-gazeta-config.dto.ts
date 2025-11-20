import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsArray, IsInt, ArrayMaxSize, ArrayMinSize, ValidateIf } from 'class-validator';
import { CategoryBasicDto } from './destaque-config.dto';

// DTO para criar/atualizar configuração de Top Gazeta
export class CreateTopGazetaConfigDto {
  @ApiProperty({
    description: 'Modo aleatório ativado (se true, não precisa selecionar categorias)',
    example: false,
  })
  @IsBoolean()
  randomMode: boolean;

  @ApiProperty({
    description: 'IDs das categorias selecionadas (exatamente 3, se randomMode = false)',
    example: [4, 5, 6],
    required: false,
  })
  @ValidateIf((o) => !o.randomMode)
  @IsArray()
  @ArrayMinSize(3, { message: 'Selecione exatamente 3 categorias para o Top Gazeta' })
  @ArrayMaxSize(3, { message: 'Selecione exatamente 3 categorias para o Top Gazeta' })
  @IsInt({ each: true })
  categoryIds?: number[];
}

export class UpdateTopGazetaConfigDto {
  @ApiProperty({
    description: 'Modo aleatório ativado',
    example: false,
    required: false,
  })
  @IsBoolean()
  randomMode?: boolean;

  @ApiProperty({
    description: 'IDs das categorias selecionadas (exatamente 3, se randomMode = false)',
    example: [4, 5, 6],
    required: false,
  })
  @ValidateIf((o) => o.randomMode === false)
  @IsArray()
  @ArrayMinSize(3, { message: 'Selecione exatamente 3 categorias para o Top Gazeta' })
  @ArrayMaxSize(3, { message: 'Selecione exatamente 3 categorias para o Top Gazeta' })
  @IsInt({ each: true })
  categoryIds?: number[];
}

// DTO de resposta
export class TopGazetaConfigResponseDto {
  @ApiProperty({ description: 'ID da configuração', example: 1 })
  id: number;

  @ApiProperty({ description: 'Modo aleatório ativo', example: false })
  randomMode: boolean;

  @ApiProperty({ 
    description: 'Categorias selecionadas', 
    type: [CategoryBasicDto],
    example: []
  })
  categories: CategoryBasicDto[];

  @ApiProperty({ description: 'IDs das categorias (para facilitar)', example: [4, 5, 6] })
  categoryIds: number[];

  @ApiProperty({ description: 'Data de criação', example: '2025-11-19T14:00:00.000Z' })
  createdAt: string;

  @ApiProperty({ description: 'Data de atualização', example: '2025-11-19T14:00:00.000Z' })
  updatedAt: string;

  @ApiProperty({ description: 'ID do usuário criador', example: 1 })
  createdBy: number;
}

