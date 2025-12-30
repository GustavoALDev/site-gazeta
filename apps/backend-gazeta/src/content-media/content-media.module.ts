import { Module } from '@nestjs/common';
import { ContentMediaController } from './content-media.controller';
import { ContentMediaService } from './content-media.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ContentMediaController],
  providers: [ContentMediaService],
  exports: [ContentMediaService]
})
export class ContentMediaModule {}

