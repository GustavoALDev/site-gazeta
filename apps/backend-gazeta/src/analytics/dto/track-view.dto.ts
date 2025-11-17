import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsInt, IsNumber } from 'class-validator';

export class TrackViewDto {
  @ApiProperty({ description: 'ID da notícia (se aplicável)', required: false })
  @IsOptional()
  @IsInt()
  newsId?: number;

  @ApiProperty({ description: 'Caminho da página', example: '/news/prefeitura-anuncia-obras' })
  @IsString()
  path: string;

  @ApiProperty({ description: 'Referer', required: false })
  @IsOptional()
  @IsString()
  referer?: string;

  @ApiProperty({ description: 'ID da sessão', required: false })
  @IsOptional()
  @IsString()
  sessionId?: string;

  @ApiProperty({ description: 'Duração na página em segundos', required: false })
  @IsOptional()
  @IsNumber()
  duration?: number;
}

