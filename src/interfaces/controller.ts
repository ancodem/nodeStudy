import { NextFunction, Request, Response, Router } from 'express';

type Handler<T = Request | Error> = T extends Error
	? (err: T, req: Request, res: Response, next: NextFunction) => void
	: (req: T, res: Response, next: NextFunction) => void;

export interface RouteController {
	path: string;
	handler: Handler;
	method: keyof Pick<Router, 'put' | 'all' | 'delete' | 'get' | 'post' | 'patch' | 'use'>;
}

export interface IUserController {
	register(_req: Request, res: Response, next: NextFunction): void;
	login(_req: Request, res: Response, next: NextFunction): void;
}
