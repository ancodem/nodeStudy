import { Response, Router } from 'express';
import { injectable } from 'inversify';
import { IRouteController } from '../interfaces/controller';
import { ILogger } from '../interfaces/logger';
import 'reflect-metadata';

@injectable()
export abstract class BaseController {
  private _router: Router;
  protected logger: ILogger;

  constructor({ logger }: { logger: ILogger }) {
    this._router = Router();
    this.logger = logger;
  }

  public get router(): Router {
    return this._router;
  }

  private send<T>({ res, code, message }: { res: Response; code: number; message: T }): Response {
    return res.status(code).type('application/json').json(message);
  }

  public ok<T>(payload: { res: Response; message: T }): Response {
    return this.send({ code: 200, ...payload });
  }

  public created(res: Response): Response {
    return res.sendStatus(201);
  }

  protected bindRoutes(routes: IRouteController[], prefix?: string): void {
    for (const route of routes) {
      this.logger.log(`[${route.method}] ${prefix || ''}${route.path}`);
      const middlewares = route.middlewares?.map((m) => m.execute.bind(m));

      const pipeline = middlewares
        ? [...middlewares, route.handler.bind(this)]
        : route.handler.bind(this);

      this.router[route.method](`${prefix || ''}${route.path}`, pipeline);
    }
  }
}
