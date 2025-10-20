import { Module } from '@nestjs/common';
import { VideoService } from './video.service';
import { VideoController } from './video.controller';
import { VideoProcessingService } from './services/video-processing.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [VideoController],
  providers: [VideoService, VideoProcessingService],
  exports: [VideoService],
})
export class VideoModule {}

