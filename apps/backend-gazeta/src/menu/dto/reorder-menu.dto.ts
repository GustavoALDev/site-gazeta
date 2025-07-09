import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsNumber, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class MenuOrderDto {
  @ApiProperty({
    description: 'ID do menu',
    example: 1
  })
  @IsNotEmpty({ message: 'ID é obrigatório' })
  @IsNumber({}, { message: 'ID deve ser um número' })
  id: number;

  @ApiProperty({
    description: 'Nova ordem do menu',
    example: 2
  })
  @IsNotEmpty({ message: 'Ordem é obrigatória' })
  @IsNumber({}, { message: 'Ordem deve ser um número' })
  order: number;
}

export class ReorderMenuDto {
  @ApiProperty({
    description: 'Array com IDs e novas ordens dos menus',
    type: [MenuOrderDto]
  })
  @IsArray({ message: 'Menus deve ser um array' })
  @ValidateNested({ each: true })
  @Type(() => MenuOrderDto)
  menus: MenuOrderDto[];
} 