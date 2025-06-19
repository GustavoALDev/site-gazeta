import { Module } from '@nestjs/common';
import { AdvertisementService } from './advertisement.service';
import { AdvertisementController } from './advertisement.controller';
import { AdvertisementImageService } from './services/advertisement-image.service';
import { PrismaModule } from '../prisma/prisma.module';
import { MediaModule } from '../media/media.module';

@Module({
  imports: [PrismaModule, MediaModule],
  controllers: [AdvertisementController],
  providers: [AdvertisementService, AdvertisementImageService],
  exports: [AdvertisementService],
})
export class AdvertisementModule {} 