import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsIn, IsBoolean, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class AdvertisementQueryDto {
  @ApiProperty({ 
    description: 'Local de exibição do anúncio', 
    example: 'home',
    enum: ['home', 'news'],
    required: false
  })
  @IsOptional()
  @IsIn(['home', 'news'], {
    message: 'Local de exibição deve ser: home ou news'
  })
  placement?: string;

  @ApiProperty({ 
    description: 'Posição do anúncio na página', 
    example: 'top',
    enum: ['top', 'bottom', 'sidebar', 'header', 'footer', 'content'],
    required: false
  })
  @IsOptional()
  @IsIn(['top', 'bottom', 'sidebar', 'header', 'footer', 'content'], {
    message: 'Posição deve ser: top, bottom, sidebar, header, footer ou content'
  })
  position?: string;

  @ApiProperty({ 
    description: 'Se o anúncio está ativo', 
    example: true,
    required: false
  })
  @IsOptional()
  @IsBoolean({ message: 'Status ativo deve ser um boolean' })
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  isActive?: boolean;

  @ApiProperty({ 
    description: 'Buscar por título ou descrição', 
    example: 'promoção',
    required: false
  })
  @IsOptional()
  @IsString({ message: 'Termo de busca deve ser uma string' })
  search?: string;
} 