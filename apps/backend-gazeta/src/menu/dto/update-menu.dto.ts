import { PartialType, ApiProperty } from '@nestjs/swagger';
import { CreateMenuDto } from './create-menu.dto';

export class UpdateMenuDto extends PartialType(CreateMenuDto) {
  @ApiProperty({
    description: 'Tipo do menu (opcional). Se omitido, será inferido pelos campos slug/routerLink/externalLink (exatamente um deles deve ser enviado).',
    enum: ['internal', 'external', 'category'],
    enumName: 'MenuType',
    required: false
  })
  type?: string;
}