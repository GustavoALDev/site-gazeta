import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { NewsStatus } from './news-status.enum';

export class UpdateNewsStatusDto {
  @ApiProperty({
    description: 'Novo status da notícia',
    enum: NewsStatus,
    example: NewsStatus.ACTIVE
  })
  @IsNotEmpty({ message: 'Status é obrigatório' })
  @IsEnum(NewsStatus, { message: 'Status deve ser ACTIVE, INACTIVE ou TRASH' })
  status: NewsStatus;
} 