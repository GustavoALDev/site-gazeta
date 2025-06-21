import { ApiProperty } from '@nestjs/swagger';
import { IsArray, ValidateNested, ArrayMinSize } from 'class-validator';
import { Type } from 'class-transformer';
import { HomeConfigOrderDto } from './home-config-response.dto';

export class BulkUpdateOrderDto {
  @ApiProperty({ 
    description: 'Array com as configurações e suas novas ordens',
    type: [HomeConfigOrderDto],
    example: [
      { id: 1, displayOrder: 2 },
      { id: 2, displayOrder: 1 },
      { id: 3, displayOrder: 3 }
    ]
  })
  @IsArray({ message: 'Configurações deve ser um array' })
  @ArrayMinSize(1, { message: 'Deve haver pelo menos uma configuração' })
  @ValidateNested({ each: true })
  @Type(() => HomeConfigOrderDto)
  configs: HomeConfigOrderDto[];
} 