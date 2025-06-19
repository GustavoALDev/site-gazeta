import { ApiProperty } from '@nestjs/swagger';

export class AdvertisementResponseDto {
  @ApiProperty({ description: 'ID do anúncio', example: 1 })
  id: number;

  @ApiProperty({ description: 'Título do anúncio', example: 'Promoção Especial' })
  title: string;

  @ApiProperty({ description: 'Descrição do anúncio', example: 'Uma oferta imperdível!', required: false })
  description?: string;

  @ApiProperty({ description: 'URL da imagem do anúncio', example: 'https://exemplo.com/anuncio.jpg' })
  imageUrl: string;

  @ApiProperty({ description: 'URL de redirecionamento', example: 'https://exemplo.com/promocao', required: false })
  clickUrl?: string;

  @ApiProperty({ 
    description: 'Posição do anúncio', 
    example: 'top',
    enum: ['top', 'bottom', 'sidebar', 'header', 'footer', 'content']
  })
  position: string;

  @ApiProperty({ 
    description: 'Local de exibição', 
    example: 'home',
    enum: ['home', 'news']
  })
  placement: string;

  @ApiProperty({ description: 'Se o anúncio está ativo', example: true })
  isActive: boolean;

  @ApiProperty({ description: 'Prioridade de exibição', example: 1 })
  priority: number;

  @ApiProperty({ description: 'Data de início da campanha', example: '2025-01-20T00:00:00.000Z', required: false })
  startDate?: string;

  @ApiProperty({ description: 'Data de fim da campanha', example: '2025-12-31T23:59:59.000Z', required: false })
  endDate?: string;

  @ApiProperty({ description: 'Data de criação', example: '2025-01-20T10:00:00.000Z' })
  createdAt: string;

  @ApiProperty({ description: 'Data de atualização', example: '2025-01-20T10:00:00.000Z' })
  updatedAt: string;

  @ApiProperty({ description: 'ID do usuário criador', example: 1 })
  createdBy: number;

  @ApiProperty({ description: 'Nome do usuário criador', example: 'João Silva' })
  creatorName: string;
} 