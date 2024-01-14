import { Response, Request, NextFunction } from 'express';
import { inject, injectable } from 'inversify';
import { IErrorHandler } from '../interfaces/errorHandler';
import { ILogger } from '../interfaces/logger';
import { TYPES } from '../types';
import 'reflect-metadata';

export class HTTPError extends Error {
  status: number;
  context?: string;

  constructor({ status, message, context }: { status: number; message: string; context?: string }) {
    super(message);
    this.status = status;
    this.context = context;
  }
}

@injectable()
export class ErrorHandler implements IErrorHandler {
  constructor(@inject(TYPES.ILogger) private logger: ILogger) {}

  public catch = (
    err: Error | HTTPError,
    _req: Request,
    res: Response,
    next: NextFunction,
  ): void => {
    if (err instanceof HTTPError) {
      this.logger.log(`[${err.status}] ${err.message} ${err.context}`);
      res.status(err.status).send({ name: err.name, message: err.message, context: err.context });
    } else {
      this.logger.log(`[${err.name}] ${err.message} ${err.stack}`);
      res.status(500).send({ message: err.message, name: err.name });
    }
    next();
  };
}
