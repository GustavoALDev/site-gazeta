import { ApiProperty } from '@nestjs/swagger';

export class ContentMediaResponseDto {
  @ApiProperty({
    description: 'URL pública da imagem de conteúdo',
    example: 'http://localhost:3000/uploads/1704067200000/imagem.jpg'
  })
  url: string;
}

