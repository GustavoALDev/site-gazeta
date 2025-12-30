import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

// DTO para criar/atualizar manutenção
export class CreateMaintenanceConfigDto {
  @ApiProperty({
    description: 'Status de manutenção (true = site fechado, false = site aberto)',
    example: false,
    default: false
  })
  @IsBoolean()
  isActive: boolean;
}

export class UpdateMaintenanceConfigDto {
  @ApiProperty({
    description: 'Status de manutenção (true = site fechado, false = site aberto)',
    example: false
  })
  @IsBoolean()
  isActive: boolean;
}

// DTO de resposta
export class MaintenanceConfigResponseDto {
  @ApiProperty({ description: 'ID da configuração', example: 1 })
  id: number;

  @ApiProperty({ 
    description: 'Status de manutenção', 
    example: false,
    default: false 
  })
  isActive: boolean;

  @ApiProperty({ description: 'Data de criação', example: '2025-11-19T14:00:00.000Z' })
  createdAt: string;

  @ApiProperty({ description: 'Data de atualização', example: '2025-11-19T14:00:00.000Z' })
  updatedAt: string;

  @ApiProperty({ description: 'ID do usuário criador', example: 1 })
  createdBy: number;
}

