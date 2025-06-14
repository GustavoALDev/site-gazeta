import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class MediaSizeDto {
  @ApiProperty({ description: 'URL da imagem original', example: 'https://exemplo.com/original.jpg' })
  @IsString()
  original: string;

  @ApiProperty({ description: 'URL da imagem pequena', example: 'https://exemplo.com/small.jpg' })
  @IsString()
  small: string;

  @ApiProperty({ description: 'URL da imagem média', example: 'https://exemplo.com/medium.jpg' })
  @IsString()
  medium: string;

  @ApiProperty({ description: 'URL da imagem super pequena', example: 'https://exemplo.com/super-small.jpg' })
  @IsString()
  superSmall: string;
}

export class CreateMediaDto {
  @ApiProperty({ 
    description: 'Se a mídia é destaque', 
    example: false,
    default: false
  })
  @IsBoolean()
  emphasis: boolean;

  @ApiProperty({ 
    description: 'Tamanhos da imagem', 
    required: false,
    type: [MediaSizeDto]
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MediaSizeDto)
  imgSize?: MediaSizeDto[];

  @ApiProperty({ 
    description: 'Autor da mídia', 
    example: 'João Fotógrafo', 
    required: false 
  })
  @IsOptional()
  @IsString()
  author?: string;

  @ApiProperty({ 
    description: 'Data da mídia', 
    example: '2025-01-20', 
    required: false 
  })
  @IsOptional()
  @IsString()
  date?: string;
} 