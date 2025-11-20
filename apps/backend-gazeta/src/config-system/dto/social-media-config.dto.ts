import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, Matches } from 'class-validator';

// DTO para criar/atualizar redes sociais
export class CreateSocialMediaConfigDto {
  @ApiProperty({
    description: 'URL do Instagram',
    example: 'https://instagram.com/gazeta',
    required: false
  })
  @IsOptional()
  @IsString()
  @Matches(/^https?:\/\/(www\.)?instagram\.com\/.+/, { 
    message: 'URL do Instagram inválida' 
  })
  instagram?: string;

  @ApiProperty({
    description: 'URL do Facebook',
    example: 'https://facebook.com/gazeta',
    required: false
  })
  @IsOptional()
  @IsString()
  @Matches(/^https?:\/\/(www\.)?facebook\.com\/.+/, { 
    message: 'URL do Facebook inválida' 
  })
  facebook?: string;

  @ApiProperty({
    description: 'URL do YouTube',
    example: 'https://youtube.com/c/gazeta',
    required: false
  })
  @IsOptional()
  @IsString()
  @Matches(/^https?:\/\/(www\.)?youtube\.com\/.+/, { 
    message: 'URL do YouTube inválida' 
  })
  youtube?: string;

  @ApiProperty({
    description: 'URL do LinkedIn',
    example: 'https://linkedin.com/company/gazeta',
    required: false
  })
  @IsOptional()
  @IsString()
  @Matches(/^https?:\/\/(www\.)?linkedin\.com\/.+/, { 
    message: 'URL do LinkedIn inválida' 
  })
  linkedin?: string;

  @ApiProperty({
    description: 'URL do Twitter/X',
    example: 'https://twitter.com/gazeta',
    required: false
  })
  @IsOptional()
  @IsString()
  @Matches(/^https?:\/\/(www\.)?(twitter\.com|x\.com)\/.+/, { 
    message: 'URL do Twitter/X inválida' 
  })
  twitter?: string;

  @ApiProperty({
    description: 'URL do TikTok',
    example: 'https://tiktok.com/@gazeta',
    required: false
  })
  @IsOptional()
  @IsString()
  @Matches(/^https?:\/\/(www\.)?tiktok\.com\/.+/, { 
    message: 'URL do TikTok inválida' 
  })
  tiktok?: string;

  @ApiProperty({
    description: 'Número do WhatsApp (com código do país)',
    example: '+5511999999999',
    required: false
  })
  @IsOptional()
  @IsString()
  @Matches(/^\+?[1-9]\d{1,14}$/, { 
    message: 'Número do WhatsApp inválido (use formato internacional)' 
  })
  whatsapp?: string;
}

export class UpdateSocialMediaConfigDto extends CreateSocialMediaConfigDto {}

// DTO de resposta
export class SocialMediaConfigResponseDto {
  @ApiProperty({ description: 'ID da configuração', example: 1 })
  id: number;

  @ApiProperty({ description: 'URL do Instagram', example: 'https://instagram.com/gazeta' })
  instagram?: string;

  @ApiProperty({ description: 'URL do Facebook', example: 'https://facebook.com/gazeta' })
  facebook?: string;

  @ApiProperty({ description: 'URL do YouTube', example: 'https://youtube.com/c/gazeta' })
  youtube?: string;

  @ApiProperty({ description: 'URL do LinkedIn', example: 'https://linkedin.com/company/gazeta' })
  linkedin?: string;

  @ApiProperty({ description: 'URL do Twitter/X', example: 'https://twitter.com/gazeta' })
  twitter?: string;

  @ApiProperty({ description: 'URL do TikTok', example: 'https://tiktok.com/@gazeta' })
  tiktok?: string;

  @ApiProperty({ description: 'Número do WhatsApp', example: '+5511999999999' })
  whatsapp?: string;

  @ApiProperty({ description: 'Data de criação', example: '2025-11-19T14:00:00.000Z' })
  createdAt: string;

  @ApiProperty({ description: 'Data de atualização', example: '2025-11-19T14:00:00.000Z' })
  updatedAt: string;

  @ApiProperty({ description: 'ID do usuário criador', example: 1 })
  createdBy: number;
}

