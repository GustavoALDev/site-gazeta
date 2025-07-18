import { PartialType } from '@nestjs/swagger';
import { CreateYoutubePlaylistDto } from './create-youtube-playlist.dto';

export class UpdateYoutubePlaylistDto extends PartialType(CreateYoutubePlaylistDto) {} 