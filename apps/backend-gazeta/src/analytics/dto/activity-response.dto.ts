import { ApiProperty } from '@nestjs/swagger';

export class ActivityItemDto {
  @ApiProperty({ description: 'Timestamp da atividade' })
  timestamp: Date;

  @ApiProperty({ description: 'Nome do usuário', example: 'João Silva' })
  user: string;

  @ApiProperty({ description: 'Ação realizada', example: 'criou notícia' })
  action: string;

  @ApiProperty({ description: 'Detalhes adicionais', example: 'Notícia sobre festival' })
  detail?: string;
}

export class ActivityResponseDto {
  @ApiProperty({ type: [ActivityItemDto] })
  activities: ActivityItemDto[];
}

