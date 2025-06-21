import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsInt, IsBoolean, IsOptional, IsString, Min, Max } from 'class-validator';

export class CreateHomeCategoryConfigDto {
  @ApiProperty({ 
    description: 'ID da categoria', 
    example: 1
  })
  @IsNotEmpty({ message: 'ID da categoria é obrigatório' })
  @IsInt({ message: 'ID da categoria deve ser um número inteiro' })
  categoryId: number;

  @ApiProperty({ 
    description: 'Ordem de exibição (menor número aparece primeiro)', 
    example: 1,
    minimum: 1,
    maximum: 100
  })
  @IsNotEmpty({ message: 'Ordem de exibição é obrigatória' })
  @IsInt({ message: 'Ordem deve ser um número inteiro' })
  @Min(1, { message: 'Ordem deve ser no mínimo 1' })
  @Max(100, { message: 'Ordem deve ser no máximo 100' })
  displayOrder: number;

  @ApiProperty({ 
    description: 'Se a categoria está visível na home', 
    example: true,
    default: true
  })
  @IsOptional()
  @IsBoolean({ message: 'Visibilidade deve ser um boolean' })
  isVisible?: boolean = true;

  @ApiProperty({ 
    description: 'Número máximo de notícias a exibir desta categoria', 
    example: 6,
    default: 6,
    minimum: 1,
    maximum: 20
  })
  @IsOptional()
  @IsInt({ message: 'Máximo de notícias deve ser um número inteiro' })
  @Min(1, { message: 'Deve mostrar pelo menos 1 notícia' })
  @Max(20, { message: 'Máximo de 20 notícias por categoria' })
  maxNews?: number = 6;

  @ApiProperty({ 
    description: 'Se deve mostrar o título da categoria', 
    example: true,
    default: true
  })
  @IsOptional()
  @IsBoolean({ message: 'Mostrar título deve ser um boolean' })
  showTitle?: boolean = true;

  @ApiProperty({ 
    description: 'Título personalizado para a categoria (opcional)', 
    example: 'Notícias Regionais',
    required: false
  })
  @IsOptional()
  @IsString({ message: 'Título personalizado deve ser uma string' })
  customTitle?: string;
} 