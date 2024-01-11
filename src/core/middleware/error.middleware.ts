import { NextFunction, Request, Response } from 'express';
import { HttpException } from '@/core/exceptions/http-exception';
import { logger } from '@/core/utils/winston-logger';

export const errorMiddleware = (
  error: HttpException,
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  try {
    const status: number = error.status || 500;
    const message: string = error.message || 'Something went wrong';
    const stack = error.stack;
    const errors = error.errors || {};

    const errorInfo = {
      method: request.method,
      path: request.path,
      status,
      message,
      stack: status === 500 ? stack : undefined,
      ip: request.ip,
      userAgent: request.get('User-Agent'),
    };

    logger.error(
      `[${request.method}] ${errorInfo.ip} ${errorInfo.path} >> StatusCode:: ${
        errorInfo.status
      }, Message:: ${errorInfo.message}\n${errorInfo.stack ?? ''}`,
    );
    response.status(status).json({
      message,
      ...(errors && { errors }),
    });
  } catch (error) {
    next(error);
  }
};
