import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AnalyticsService } from '../analytics.service';
import {
  LOG_ACTIVITY_KEY,
  LogActivityOptions,
} from '../decorators/log-activity.decorator';

@Injectable()
export class ActivityLoggerInterceptor implements NestInterceptor {
  constructor(
    private reflector: Reflector,
    private analyticsService: AnalyticsService
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const options = this.reflector.get<LogActivityOptions>(
      LOG_ACTIVITY_KEY,
      context.getHandler()
    );

    if (!options) {
      return next.handle();
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user; // do JWT
    const userAgent = request.headers['user-agent'];
    const ipAddress = request.ip;

    return next.handle().pipe(
      tap((response) => {
        if (user && user.userId) {
          // Tentar extrair ID da entidade da resposta
          let entityId = response?.id;
          if (!entityId && request.params?.id) {
            entityId = parseInt(request.params.id);
          }

          this.analyticsService
            .logActivity(
              user.userId,
              options.action,
              options.entityType,
              entityId,
              options.description,
              ipAddress,
              userAgent
            )
            .catch((error) => {
              console.error('Failed to log activity:', error);
            });
        }
      })
    );
  }
}

