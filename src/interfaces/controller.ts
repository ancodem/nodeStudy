import { NextFunction, Request, Response, Router } from 'express';
import { IMiddleware } from '../common/middleware.interface';

type Handler<T = Request | Error> = T extends Error
  ? (err: T, req: Request, res: Response, next: NextFunction) => void
  : (req: T, res: Response, next: NextFunction) => void;

export interface IRouteController {
  path: string;
  handler: Handler;
  method: keyof Pick<Router, 'put' | 'all' | 'delete' | 'get' | 'post' | 'patch' | 'use'>;
  middlewares?: IMiddleware[];
}

export interface IUserController {
  register(_req: Request, res: Response, next: NextFunction): void;
  login(_req: Request, res: Response, next: NextFunction): void;
  info(_req: Request, res: Response, next: NextFunction): void;
}
