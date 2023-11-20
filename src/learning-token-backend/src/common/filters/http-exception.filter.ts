import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpException,
    HttpStatus
} from '@nestjs/common'
import { Request, Response } from 'express'
import * as fs from 'fs'
import { HttpExceptionResponse } from 'src/common/filters/models/http-exception-response.interface'

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp()
        const response = ctx.getResponse<Response>()
        const request = ctx.getRequest<Request>()

        let status: HttpStatus
        let errorMessage: string

        if (exception instanceof HttpException) {
            status = exception.getStatus()
            const errorResponse = exception.getResponse()
            errorMessage =
                (errorResponse as HttpExceptionResponse).error ||
                exception.message
        } else {
            status = HttpStatus.INTERNAL_SERVER_ERROR
            errorMessage = 'Critical internal server error occurred!'
        }

        const errorResponse = this.getErrorResponse(
            status,
            errorMessage,
            request
        )

        const errorLog = this.getErrorLog(errorResponse, request, exception)
        this.writeErrorLogToFile(errorLog)
        response.status(status).json(errorResponse)
    }

    private getErrorResponse = (
        status: HttpStatus,
        errorMessage: string,
        request: Request
    ): HttpExceptionResponse => ({
        statusCode: status,
        error: errorMessage
    })

    private getErrorLog = (
        errorResponse: HttpExceptionResponse,
        request: Request,
        exception: unknown
    ): string => {
        const { statusCode, error } = errorResponse
        const { method, url } = request
        const errorLog = `Response Code: ${statusCode} - Method: ${method} - URL: ${url}\n\n
      ${JSON.stringify(errorResponse)}\n\n
      User: ${JSON.stringify(request.user ?? 'Not signed in')}\n\n
      ${exception instanceof HttpException ? exception.stack : error}\n\n`
        return errorLog
    }

    private writeErrorLogToFile = (errorLog: string): void => {
        fs.appendFile('error.log', errorLog, 'utf8', (err) => {
            if (err) throw err
        })
    }
}
