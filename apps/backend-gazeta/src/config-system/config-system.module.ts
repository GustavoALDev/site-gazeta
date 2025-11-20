import { Module } from '@nestjs/common';
import { ConfigSystemController } from './config-system.controller';
import { ConfigSystemService } from './config-system.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ConfigSystemController],
  providers: [ConfigSystemService],
  exports: [ConfigSystemService],
})
export class ConfigSystemModule {}

