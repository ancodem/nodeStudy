import express, { Express, NextFunction, Request, Response } from 'express';
import { Server } from 'http';
import { inject, injectable } from 'inversify';
import { BaseController } from './common/base.controller';
import { UserController } from './users/users.controller';
import { ILogger } from './interfaces/logger';
import { HTTPError } from './services/error.service';
import { TYPES } from './types';
import 'reflect-metadata';
import { IErrorHandler } from './interfaces/errorHandler';
import { json } from 'body-parser';
import { PrismaService } from './database/prisma.service';
import { AuthMiddleware } from './common/auth.middleweare';
import { IConfigService } from './config/config.service.interface';
import { EnvKeyFor } from './constants/config';

@injectable()
export class App {
  public app: Express;
  private server: Server;
  private logger: ILogger;
  private port = 8080;

  constructor(
    @inject(TYPES.ILogger) logger: ILogger,
    @inject(TYPES.UserController) private userController: UserController,
    @inject(TYPES.ErrorHandler) private errorHandler: IErrorHandler,
    @inject(TYPES.PrismaService) private database: PrismaService,
    @inject(TYPES.ConfigService) private configService: IConfigService,
  ) {
    this.app = express();
    this.logger = logger;
  }

  public async init(): Promise<void> {
    this.addMiddleware();
    this.addRoutes([this.userController]);
    this.addErrorHandlers([this.errorHandler.catch]);
    await this.database.connect();
    this.server = this.app.listen(this.port);
    this.logger.log(`Сервер запущен на http://.localhost:${this.port}`);
  }

  public disconnect(): void {
    this.server.close();
  }

  public addMiddleware(): void {
    this.app.use(json());
    const authMiddleware = new AuthMiddleware(this.configService.get(EnvKeyFor.SECRET));
    this.app.use(authMiddleware.execute.bind(authMiddleware));
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
