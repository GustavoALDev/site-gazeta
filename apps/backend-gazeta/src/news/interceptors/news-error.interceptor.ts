import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
  HttpStatus,
  ConflictException,
  NotFoundException
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class NewsErrorInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((error) => {
        // Re-lançar exceções conhecidas do NestJS
        if (
          error instanceof NotFoundException ||
          error instanceof ConflictException ||
          error instanceof HttpException
        ) {
          return throwError(() => error);
        }

        // Log do erro para debug
        console.error('=== NEWS ERROR INTERCEPTOR:', error.message);
        console.error('Stack:', error.stack);

        // Retornar erro genérico para o cliente
        return throwError(
          () =>
            new HttpException(
              {
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                message: 'Erro no servidor, tente novamente mais tarde',
                error: 'Internal Server Error'
              },
              HttpStatus.INTERNAL_SERVER_ERROR
            )
        );
      })
    );
  }
}

