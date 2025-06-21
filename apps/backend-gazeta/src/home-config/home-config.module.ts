import { Module } from '@nestjs/common';
import { HomeConfigService } from './home-config.service';
import { HomeConfigController } from './home-config.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [HomeConfigController],
  providers: [HomeConfigService],
  exports: [HomeConfigService],
})
export class HomeConfigModule {} 