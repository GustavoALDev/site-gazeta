import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { ContentMediaModule } from '../content-media/content-media.module';
import { MediaModule } from '../media/media.module';

// Core Services
import { NewsFormatterService } from './core/news-formatter.service';
import { NewsCoreService } from './core/news-core.service';
import { NewsCoreController } from './core/news-core.controller';

// Status Services
import { NewsStatusService } from './status/news-status.service';
import { NewsStatusController } from './status/news-status.controller';

// Query Services
import { NewsQueryService } from './query/news-query.service';
import { NewsQueryController } from './query/news-query.controller';

// Analytics Services
import { NewsAnalyticsService } from './analytics/news-analytics.service';
import { NewsAnalyticsController } from './analytics/news-analytics.controller';

// Interceptors
import { NewsErrorInterceptor } from './interceptors/news-error.interceptor';

@Module({
  imports: [PrismaModule, ContentMediaModule, MediaModule],
  controllers: [
    // IMPORTANTE: QueryController deve vir ANTES do CoreController
    // para que rotas específicas (featured, latest-news, etc) sejam
    // processadas antes da rota genérica :id
    NewsQueryController,
    NewsStatusController,
    NewsAnalyticsController,
    NewsCoreController
  ],
  providers: [
    // Core Services
    NewsFormatterService,
    NewsCoreService,
    
    // Status Services
    NewsStatusService,
    
    // Query Services
    NewsQueryService,
    
    // Analytics Services
    NewsAnalyticsService,
    
    // Interceptors
    NewsErrorInterceptor
  ],
  exports: [
    NewsCoreService,
    NewsStatusService,
    NewsQueryService,
    NewsAnalyticsService,
    NewsFormatterService
  ],
})
export class NewsModule {}
