import { ApiProperty } from '@nestjs/swagger';

export class TimeSeriesPointDto {
  @ApiProperty({ description: 'Label do ponto', example: '01/01' })
  label: string;

  @ApiProperty({ description: 'Valor do ponto', example: 1250 })
  value: number;
}

export class TimeSeriesResponseDto {
  @ApiProperty({ type: [String] })
  labels: string[];

  @ApiProperty({ type: [Number] })
  values: number[];
}

