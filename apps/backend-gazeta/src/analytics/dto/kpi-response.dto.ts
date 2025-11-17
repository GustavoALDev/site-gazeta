import { ApiProperty } from '@nestjs/swagger';

export class KpiMetricDto {
  @ApiProperty({ description: 'Label da métrica', example: 'Acessos' })
  label: string;

  @ApiProperty({ description: 'Valor da métrica', example: 25000 })
  value: number;

  @ApiProperty({ description: 'Variação percentual em relação ao período anterior', example: 15.5 })
  deltaPercent?: number;
}

export class KpiResponseDto {
  @ApiProperty({ type: [KpiMetricDto] })
  kpis: KpiMetricDto[];
}

