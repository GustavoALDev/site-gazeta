import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsBoolean, IsInt, IsDateString, IsIn, IsUrl, Min, Max } from 'class-validator';
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
  @IsUrl({}, { message: 'URL de clique deve ser uma URL válida' })
  clickUrl?: string;

  @ApiProperty({ 
    description: 'Posição do anúncio na página', 
    example: 'top',
    enum: ['top', 'bottom', 'sidebar', 'header', 'footer', 'content']
  })
  @IsNotEmpty({ message: 'Posição é obrigatória' })
  @IsIn(['top', 'bottom', 'sidebar', 'header', 'footer', 'content'], {
    message: 'Posição deve ser: top, bottom, sidebar, header, footer ou content'
  })
  position: string;

  @ApiProperty({ 
    description: 'Local de exibição do anúncio', 
    example: 'home',
    enum: ['home', 'news']
  })
  @IsNotEmpty({ message: 'Local de exibição é obrigatório' })
  @IsIn(['home', 'news'], {
    message: 'Local de exibição deve ser: home ou news'
  })
  placement: string;

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