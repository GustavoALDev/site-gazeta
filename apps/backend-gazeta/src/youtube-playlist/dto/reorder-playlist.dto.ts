import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, ArrayMinSize } from 'class-validator';

export class ReorderPlaylistDto {
  @ApiProperty({ 
    description: 'Array com os IDs dos vídeos na nova ordem',
    example: [3, 1, 2],
    isArray: true,
    type: Number
  })
  @IsArray({ message: 'A ordem deve ser um array' })
  @ArrayMinSize(1, { message: 'Deve ter pelo menos um item' })
  @IsNumber({}, { each: true, message: 'Todos os itens devem ser números' })
  videoIds: number[];
} 