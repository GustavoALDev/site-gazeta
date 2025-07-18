import { Module } from '@nestjs/common';
import { YoutubePlaylistService } from './youtube-playlist.service';
import { YoutubePlaylistController } from './youtube-playlist.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [YoutubePlaylistController],
  providers: [YoutubePlaylistService],
  exports: [YoutubePlaylistService]
})
export class YoutubePlaylistModule {} 