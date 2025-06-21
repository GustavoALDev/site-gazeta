import { PartialType } from '@nestjs/swagger';
import { CreateHomeCategoryConfigDto } from './create-home-config.dto';

export class UpdateHomeCategoryConfigDto extends PartialType(CreateHomeCategoryConfigDto) {} 