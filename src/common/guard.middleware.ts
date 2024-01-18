import { Request, Response, NextFunction } from 'express';
import { IMiddleware } from './middleware.interface';
import { verify } from 'jsonwebtoken';

export class GuardMiddleware implements IMiddleware {
  constructor(private secret: string) {}

  execute(req: Request, resp: Response, next: NextFunction): void {
    if (req.headers.authorization) {
      const token = req.headers.authorization.split(' ')[1];

      verify(token, this.secret, (err, payload) => {
        if (payload && typeof payload !== 'string' && 'email' in payload) {
          next();
        } else {
          resp.status(401).send(`Не удалось авторизовать пользователя. ${err?.message}`);
        }
      });
    } else {
      resp.status(401).send('Не удалось авторизовать пользователя');
    }
  }
}
