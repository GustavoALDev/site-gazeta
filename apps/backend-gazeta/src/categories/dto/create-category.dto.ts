import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MinLength, MaxLength, IsBoolean } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({
    description: 'Nome da categoria',
    example: 'Tecnologia',
    minLength: 2,
    maxLength: 100
  })
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  @IsString({ message: 'Nome deve ser uma string' })
  @MinLength(2, { message: 'Nome deve ter no mínimo 2 caracteres' })
  @MaxLength(100, { message: 'Nome deve ter no máximo 100 caracteres' })
  name: string;

  @ApiProperty({
    description: 'Descrição da categoria',
    example: 'Notícias sobre tecnologia, inovação e startups',
    required: false
  })
  @IsOptional()
  @IsString({ message: 'Descrição deve ser uma string' })
  @MaxLength(500, { message: 'Descrição deve ter no máximo 500 caracteres' })
  description?: string;

  @ApiProperty({
    description: 'Slug da categoria (URL amigável)',
    example: 'tecnologia',
    minLength: 2,
    maxLength: 100
  })
  @IsNotEmpty({ message: 'Slug é obrigatório' })
  @IsString({ message: 'Slug deve ser uma string' })
  @MinLength(2, { message: 'Slug deve ter no mínimo 2 caracteres' })
  @MaxLength(100, { message: 'Slug deve ter no máximo 100 caracteres' })
  slug: string;

  @ApiProperty({
    description: 'Cor identificadora da categoria (hexadecimal ou nome)',
    example: '#FF5733',
    required: false
  })
  @IsOptional()
  @IsString({ message: 'Color deve ser uma string' })
  @MaxLength(20, { message: 'Color deve ter no máximo 20 caracteres' })
  color?: string;

  @ApiProperty({
    description: 'Status ativo da categoria',
    example: true,
    required: false,
    default: true
  })
  @IsOptional()
  @IsBoolean({ message: 'isActive deve ser um valor booleano' })
  isActive?: boolean;
} 