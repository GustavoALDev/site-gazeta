import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ContentMediaResponseDto {
  @ApiProperty({
    description: 'URL pública da imagem de conteúdo',
    example: 'http://localhost:3000/uploads/1704067200000/imagem.jpg'
  })
  url: string;

  @ApiPropertyOptional({
    description: 'ID do registro em content_media (confirma gravação no banco)',
    example: 42
  })
  mediaId?: number;

  @ApiPropertyOptional({
    description: 'Tamanho do arquivo enviado em bytes (quando disponível)',
    example: 8_045_312
  })
  sizeBytes?: number;
}

