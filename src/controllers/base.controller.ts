import { Response, Router } from "express";
import { RouteController } from "../interfaces/controller";
import { LoggerService } from "../services/logger.service";

export abstract class BaseController {
  private _router: Router;
  protected logger: LoggerService;

  constructor({ logger }: { logger: LoggerService }) {
    this._router = Router();
    this.logger = logger;
  }

  public get router() {
    return this._router;
  }

  private send<T>({
    res,
    code,
    message,
  }: {
    res: Response;
    code: number;
    message: T;
  }) {
    return res.status(code).type("application/json").json(message);
  }

  public ok<T>(payload: { res: Response; message: T }) {
    return this.send({ code: 200, ...payload });
  }

  public created(res: Response) {
    return res.sendStatus(201);
  }

  protected bindRoutes(routes: RouteController[], prefix?: string) {
    for (const route of routes) {
      this.logger.log(`[${route.method}] ${prefix || ""}${route.path}`);
      this.router[route.method](
        `${prefix || ""}${route.path}`,
        route.handler.bind(this),
      );
    }
  }
}
