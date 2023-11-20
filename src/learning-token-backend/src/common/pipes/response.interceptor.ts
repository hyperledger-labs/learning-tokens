import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor
} from '@nestjs/common'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'

export interface Response<T> {
    message: string
    data: T
}

@Injectable()
export class TransformInterceptor<T>
    implements NestInterceptor<T, Response<T>>
{
    intercept(
        context: ExecutionContext,
        next: CallHandler
    ): Observable<Response<any>> {
        return next.handle().pipe(
            map((data) => ({
                statusCode: data.statusCode,
                message: data.message,
                data: {
                    result: data.result
                }
            }))
        )
    }
}
