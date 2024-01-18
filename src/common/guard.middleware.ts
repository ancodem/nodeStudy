import { Request, Response, NextFunction } from 'express';
import { IMiddleware } from './middleware.interface';

export class GuardMiddleware implements IMiddleware {
  execute(req: Request, resp: Response, next: NextFunction): void {
    if (req.user) {
      return next();
    }

    resp.status(401).send('Не удалось авторизовать пользователя');
  }
}
