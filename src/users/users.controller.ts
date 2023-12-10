import { BaseController } from "../controllers/base.controller";
import { RouteController } from "../interfaces/controller";
import { LoggerService } from "../services/logger.service";

export class UsersController extends BaseController {
  constructor({
    routes,
    logger,
  }: {
    routes: RouteController[];
    logger: LoggerService;
  }) {
    super({ logger });
    this.bindRoutes(routes, '/users');
  }
}
