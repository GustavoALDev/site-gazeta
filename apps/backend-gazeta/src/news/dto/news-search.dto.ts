import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MinLength } from 'class-validator';

export class NewsSearchDto {
  @ApiProperty({
    description: 'Termo de busca para pesquisar em título, subtítulo e nome da categoria',
    required: true,
    example: 'tecnologia',
    minLength: 2
  })
  @IsString({ message: 'O termo de busca deve ser uma string' })
  @MinLength(2, { message: 'O termo de busca deve ter no mínimo 2 caracteres' })
  search: string;

  @ApiProperty({
    description: 'Número máximo de resultados a retornar',
    required: false,
    example: 20,
    default: 50
  })
  @IsOptional()
  limit?: number;
}

