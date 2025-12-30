import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class DeleteContentMediaDto {
  @ApiProperty({
    description: 'URL da imagem de conteúdo a ser deletada',
    example: 'http://localhost:3000/uploads/1704067200000/imagem.jpg'
  })
  @IsString()
  @IsNotEmpty()
  url: string;
}

