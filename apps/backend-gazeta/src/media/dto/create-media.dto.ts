import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString, IsObject } from 'class-validator';

export class CreateMediaDto {
  @ApiProperty({ 
    description: 'Se a mídia é destaque', 
    example: false,
    default: false
  })
  @IsBoolean()
  emphasis: boolean;

  @ApiProperty({ 
    description: 'URLs das imagens em diferentes tamanhos', 
    required: false,
    example: {
      original: 'https://exemplo.com/original.jpg',
      medium: 'https://exemplo.com/medium.jpg',
      small: 'https://exemplo.com/small.jpg',
      superSmall: 'https://exemplo.com/super-small.jpg'
    }
  })
  @IsOptional()
  @IsObject()
  imgSize?: {
    original: string;
    medium: string;
    small: string;
    superSmall: string;
  };

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