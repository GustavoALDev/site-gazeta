import { Module } from '@nestjs/common';
import { VideoService } from './video.service';
import { VideoController } from './video.controller';
import { VideoProcessingService } from './services/video-processing.service';
import { VideoMetadataService } from './services/video-metadata.service';
import { VideoOptimizerService } from './services/video-optimizer.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [VideoController],
  providers: [VideoService, VideoProcessingService, VideoMetadataService, VideoOptimizerService],
  exports: [VideoService],
})
export class VideoModule {}

