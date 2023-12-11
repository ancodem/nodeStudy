import { Response, Request, NextFunction } from "express";
import { LoggerService } from "./logger.service";

export class HTTPError extends Error {
  status: number;
  context?: string;

  constructor({
    status,
    message,
    context,
  }: {
    status: number;
    message: string;
    context?: string;
  }) {
    super(message);
    this.status = status;
    this.context = context;
  }
}

export class ErrorHandler {
  logger: LoggerService;
  constructor(logger: LoggerService) {
    this.logger = logger;
  }

  public catch = (
    err: Error | HTTPError,
    _req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    if (err instanceof HTTPError) {
      this.logger.log(`[${err.status}] ${err.message} ${err.context}`);
      res.status(err.status).send({name: err.name, message: err.message, context: err.context });
    } else {
      this.logger.log(`[${err.name}] ${err.message} ${err.stack}`);
      res
        .status(500)
        .send({ message: err.message, name: err.name });
    }
    next();
  };
}
