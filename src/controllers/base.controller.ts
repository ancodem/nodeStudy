import { Response, Router } from 'express';
import { injectable } from 'inversify';
import { RouteController } from '../interfaces/controller';
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

	protected bindRoutes(routes: RouteController[], prefix?: string): void {
		for (const route of routes) {
			this.logger.log(`[${route.method}] ${prefix || ''}${route.path}`);
			this.router[route.method](`${prefix || ''}${route.path}`, route.handler.bind(this));
		}
	}
}
