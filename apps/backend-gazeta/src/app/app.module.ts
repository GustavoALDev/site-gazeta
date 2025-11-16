import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from '../auth/auth.module';
import { PrismaModule } from '../prisma/prisma.module';
import { CategoriesModule } from '../categories/categories.module';
import { NewsModule } from '../news/news.module';
import { MediaModule } from '../media/media.module';
import { NewsVideoModule } from '../news-video/news-video.module';
import { AdvertisementModule } from '../advertisement/advertisement.module';
import { HomeConfigModule } from '../home-config/home-config.module';
import { MenuModule } from '../menu/menu.module';
import { YoutubePlaylistModule } from '../youtube-playlist/youtube-playlist.module';
import { VideoModule } from '../video/video.module';
import { AnalyticsModule } from '../analytics/analytics.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Torna o ConfigModule disponível globalmente
      envFilePath: 'apps/backend-gazeta/.env'
    }),
    PrismaModule,
    AuthModule,
    CategoriesModule,
    NewsModule,
    MediaModule,
    NewsVideoModule,
    AdvertisementModule,
    HomeConfigModule,
    MenuModule,
    YoutubePlaylistModule,
    VideoModule,
    AnalyticsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
