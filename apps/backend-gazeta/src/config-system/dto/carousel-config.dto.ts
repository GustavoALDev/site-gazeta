import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min, Max } from 'class-validator';

// DTO para criar/atualizar carousel
export class CreateCarouselConfigDto {
  @ApiProperty({
    description: 'Limite de notícias em destaque no carrossel (mínimo: 3, máximo: 10)',
    example: 5,
    default: 5,
    minimum: 3,
    maximum: 10
  })
  @IsInt()
  @Min(3, { message: 'O limite mínimo é 3 notícias' })
  @Max(10, { message: 'O limite máximo é 10 notícias' })
  featuredNewsLimit: number;
}

export class UpdateCarouselConfigDto {
  @ApiProperty({
    description: 'Limite de notícias em destaque no carrossel (mínimo: 3, máximo: 10)',
    example: 5,
    minimum: 3,
    maximum: 10
  })
  @IsInt()
  @Min(3, { message: 'O limite mínimo é 3 notícias' })
  @Max(10, { message: 'O limite máximo é 10 notícias' })
  featuredNewsLimit: number;
}

// DTO de resposta
export class CarouselConfigResponseDto {
  @ApiProperty({ description: 'ID da configuração', example: 1 })
  id: number;

  @ApiProperty({ 
    description: 'Limite de notícias em destaque', 
    example: 5,
    default: 5 
  })
  featuredNewsLimit: number;

  @ApiProperty({ description: 'Data de criação', example: '2025-11-19T14:00:00.000Z' })
  createdAt: string;

  @ApiProperty({ description: 'Data de atualização', example: '2025-11-19T14:00:00.000Z' })
  updatedAt: string;

  @ApiProperty({ description: 'ID do usuário criador', example: 1 })
  createdBy: number;
}

