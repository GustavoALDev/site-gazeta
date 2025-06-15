import { Module } from '@nestjs/common';
import { NewsVideoService } from './news-video.service';
import { NewsVideoController } from './news-video.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [NewsVideoController],
  providers: [NewsVideoService],
  exports: [NewsVideoService],
})
export class NewsVideoModule {} 