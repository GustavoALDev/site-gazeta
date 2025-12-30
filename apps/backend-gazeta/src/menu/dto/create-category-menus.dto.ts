import { ApiProperty } from '@nestjs/swagger';
import { IsArray, ValidateNested, ArrayMinSize, IsNotEmpty, IsString, IsNumber, IsOptional, MinLength, MaxLength } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateCategoryMenuDto {
  @ApiProperty({
    description: 'Nome do menu (nome da categoria)',
    example: 'Tecnologia',
    minLength: 1,
    maxLength: 255
  })
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  @IsString({ message: 'Nome deve ser uma string' })
  @MinLength(1, { message: 'Nome deve ter no mínimo 1 caractere' })
  @MaxLength(255, { message: 'Nome deve ter no máximo 255 caracteres' })
  name: string;

  @ApiProperty({
    description: 'Slug da categoria',
    example: 'tecnologia',
    maxLength: 255
  })
  @IsNotEmpty({ message: 'Slug é obrigatório' })
  @IsString({ message: 'Slug deve ser uma string' })
  @MaxLength(255, { message: 'Slug deve ter no máximo 255 caracteres' })
  slug: string;

  @ApiProperty({
    description: 'Ordem do menu (opcional). Se não informado, será calculado automaticamente',
    example: 1,
    required: false,
    nullable: true
  })
  @IsOptional()
  @IsNumber({}, { message: 'Ordem deve ser um número' })
  order?: number | null;
}

export class CreateCategoryMenusDto {
  @ApiProperty({
    description: 'Array de menus do tipo category a serem criados',
    type: [CreateCategoryMenuDto],
    minItems: 1,
    example: [
      { name: 'Tecnologia', slug: 'tecnologia' },
      { name: 'Esportes', slug: 'esportes' },
      { name: 'Política', slug: 'politica' }
    ]
  })
  @IsArray({ message: 'Menus deve ser um array' })
  @ArrayMinSize(1, { message: 'É necessário pelo menos um menu para criar' })
  @ValidateNested({ each: true })
  @Type(() => CreateCategoryMenuDto)
  menus: CreateCategoryMenuDto[];

  @ApiProperty({
    description: 'ID do menu pai (opcional). Se informado, todos os menus serão criados como submenus',
    example: 5,
    required: false,
    nullable: true
  })
  parentId?: number | null;
}

