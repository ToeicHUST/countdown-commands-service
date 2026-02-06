import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';

@Catch()
export class ErrorHandlerFilter implements ExceptionFilter {
  private readonly logger = new Logger(this.constructor.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.BAD_REQUEST;

    const message =
      exception instanceof Error ? exception.message : 'Something went wrong';

    this.logger.error(`URL: ${request.url} | Error: ${message}`);

    if (!(exception instanceof HttpException)) {
      console.error(exception);
    }

    response.status(status).json({
      success: false,
      message: message,
      data: null,
    });
  }
}
