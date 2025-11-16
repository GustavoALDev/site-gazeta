import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsEnum } from 'class-validator';

export class MetricsQueryDto {
  @ApiProperty({
    description: 'Data inicial do período',
    example: '2024-01-01T00:00:00.000Z',
  })
  @IsDateString()
  startDate: string;

  @ApiProperty({
    description: 'Data final do período',
    example: '2024-01-31T23:59:59.999Z',
  })
  @IsDateString()
  endDate: string;

  @ApiProperty({
    description: 'Granularidade dos dados (hour ou day)',
    enum: ['hour', 'day'],
    required: false,
    default: 'day',
  })
  @IsOptional()
  @IsEnum(['hour', 'day'])
  granularity?: 'hour' | 'day';
}

