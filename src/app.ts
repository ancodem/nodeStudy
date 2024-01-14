import express, { Express, NextFunction, Request, Response } from 'express';
import { Server } from 'http';
import { inject, injectable } from 'inversify';
import { BaseController } from './controllers/base.controller';
import { UsersController } from './users/users.controller';
import { ILogger } from './interfaces/logger';
import { HTTPError } from './services/error.service';
import { TYPES } from './types';
import 'reflect-metadata';
import { IErrorHandler } from './interfaces/errorHandler';
import { json } from 'body-parser';

@injectable()
export class App {
  private app: Express;
  // @ts-expect-error not using the server yet
  private server: Server;
  private logger: ILogger;
  private port = 8080;

  constructor(
    @inject(TYPES.ILogger) logger: ILogger,
    @inject(TYPES.UserController) private userController: UsersController,
    @inject(TYPES.ErrorHandler) private errorHandler: IErrorHandler,
  ) {
    this.app = express();
    this.logger = logger;
  }

  public async init(): Promise<void> {
    this.addBodyParser();
    this.addRoutes([this.userController]);
    this.addErrorHandlers([this.errorHandler.catch]);
    this.server = this.app.listen(this.port);
    this.logger.log(`Сервер запущен на http://.localhost:${this.port}`);
  }

  public addBodyParser(): void {
    this.app.use(json());
  }

  public addRoutes(routes: BaseController[]): void {
    for (let i = 0; i < routes.length; i++) {
      this.app.use(routes[i].router);
    }
  }

  public addErrorHandlers(
    handlers: ((err: Error | HTTPError, req: Request, res: Response, next: NextFunction) => void)[],
  ): void {
    this.app.use(handlers);
  }
}
