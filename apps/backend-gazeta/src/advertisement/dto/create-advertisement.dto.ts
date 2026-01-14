import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsBoolean, IsInt, IsDateString, IsIn, IsUrl, Min, Max, ValidateIf } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateAdvertisementDto {
  @ApiProperty({ 
    description: 'Título do anúncio', 
    example: 'Promoção Especial'
  })
  @IsNotEmpty({ message: 'Título é obrigatório' })
  @IsString({ message: 'Título deve ser uma string' })
  title: string;

  @ApiProperty({ 
    description: 'Descrição do anúncio', 
    example: 'Uma oferta imperdível para você!', 
    required: false 
  })
  @IsOptional()
  @IsString({ message: 'Descrição deve ser uma string' })
  description?: string;

  @ApiProperty({ 
    description: 'URL para redirecionamento quando clicado', 
    example: 'https://exemplo.com/promocao', 
    required: false 
  })
  @IsOptional()
  @Transform(({ value }) => value === 'null' || value === '' ? null : value)
  @ValidateIf((o) => o.clickUrl !== null && o.clickUrl !== undefined && o.clickUrl !== '')
  @IsUrl({}, { message: 'URL de clique deve ser uma URL válida' })
  clickUrl?: string | null;

  @ApiProperty({ 
    description: 'Posição do anúncio na página', 
    example: 'top',
    enum: ['top', 'center', 'bottom', 'lateral']
  })
  @IsNotEmpty({ message: 'Posição é obrigatória' })
  @IsIn(['top', 'center', 'bottom', 'lateral'], {
    message: 'Posição deve ser: top, center, bottom ou lateral'
  })
  position: string;

  @ApiProperty({ 
    description: 'Local de exibição do anúncio', 
    example: 'home',
    enum: ['header', 'home', 'content']
  })
  @IsNotEmpty({ message: 'Local de exibição é obrigatório' })
  @IsIn(['header', 'home', 'content'], {
    message: 'Local de exibição deve ser: header, home ou content'
  })
  placement: string;

  @ApiProperty({ 
    description: 'Tamanho do anúncio', 
    example: '728x90',
    enum: ['728x90', '300x250', '160x600', '200x200']
  })
  @IsNotEmpty({ message: 'Tamanho é obrigatório' })
  @IsIn(['728x90', '300x250', '160x600', '200x200'], {
    message: 'Tamanho deve ser: 728x90, 300x250, 160x600 ou 200x200'
  })
  size: string;

  @ApiProperty({ 
    description: 'Se o anúncio está ativo', 
    example: true, 
    default: true 
  })
  @IsOptional()
  @IsBoolean({ message: 'Status ativo deve ser um boolean' })
  @Transform(({ value }) => value === 'true' || value === true)
  isActive?: boolean = true;

  @ApiProperty({ 
    description: 'Prioridade de exibição (maior número = maior prioridade)', 
    example: 1, 
    default: 0,
    minimum: 0,
    maximum: 10
  })
  @IsOptional()
  @IsInt({ message: 'Prioridade deve ser um número inteiro' })
  @Min(0, { message: 'Prioridade deve ser no mínimo 0' })
  @Max(10, { message: 'Prioridade deve ser no máximo 10' })
  @Transform(({ value }) => value === '' || value === null || value === undefined ? 0 : parseInt(value, 10))
  priority?: number = 0;

  @ApiProperty({ 
    description: 'Data de início da campanha', 
    example: '2025-01-20T00:00:00.000Z', 
    required: false 
  })
  @IsOptional()
  @IsDateString({}, { message: 'Data de início deve ser uma data válida' })
  startDate?: string;

  @ApiProperty({ 
    description: 'Data de fim da campanha', 
    example: '2025-12-31T23:59:59.000Z', 
    required: false 
  })
  @IsOptional()
  @IsDateString({}, { message: 'Data de fim deve ser uma data válida' })
  endDate?: string;
} 