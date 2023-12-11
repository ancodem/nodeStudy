import express, { Express, NextFunction, Request, Response } from "express";
import { Server } from "http";
import { BaseController } from "./controllers/base.controller";
import { HTTPError } from "./services/error.service";
import { LoggerService } from "./services/logger.service";

export class App {
  private app: Express;
  private port: number;
  // @ts-ignore
  private server: Server;
  private logger: LoggerService;

  constructor({ port, logger }: { port: number; logger: LoggerService }) {
    this.app = express();
    this.port = port;
    this.logger = logger;
  }

  public async init() {
    this.server = this.app.listen(this.port);
    this.logger.log(`Сервер запущен на http://.localhost:${this.port}`);
  }

  public addRoutes(routes: BaseController[]) {
    for (let i = 0; i < routes.length; i++) {
      this.app.use(routes[i].router);
    }
  }

  public addErrorHandlers(
    handlers: ((
      err: Error | HTTPError,
      req: Request,
      res: Response,
      next: NextFunction,
    ) => void)[],
  ) {
    this.app.use(handlers);
  }
}
