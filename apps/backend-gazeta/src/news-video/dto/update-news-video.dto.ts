import { PartialType } from '@nestjs/swagger';
import { CreateNewsVideoDto } from './create-news-video.dto';

export class UpdateNewsVideoDto extends PartialType(CreateNewsVideoDto) {} 