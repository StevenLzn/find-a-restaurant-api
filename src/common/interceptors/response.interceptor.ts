import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { ApiResponse } from '../interfaces/api-response.interface';
import { map, Observable } from 'rxjs';

// Interceptor para formatear las respuestas de la API
// Este interceptor envuelve las respuestas en un objeto estándar
// que incluye un campo de éxito, los datos y una marca de tiempo.
@Injectable()
export class ResponseInterceptor<T>
  implements NestInterceptor<T, ApiResponse<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResponse<T>> {
    return next.handle().pipe(
      map((response) => {
        if (response && response.data && response.meta) {
          return {
            success: true,
            data: response.data,
            meta: response.meta,
            timestamp: new Date(),
          };
        }
        return {
          success: true,
          data: response,
          timestamp: new Date(),
        };
      }),
    );
  }
}
