import { Response, Request, NextFunction } from 'express';

export interface IMiddleware {
  execute(req: Request, resp: Response, next: NextFunction): void;
}
