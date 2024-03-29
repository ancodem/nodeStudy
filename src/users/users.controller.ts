// route handling logic
import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { BaseController } from '../common/base.controller';
import { ILogger } from '../interfaces/logger';
import { TYPES } from '../types';
import 'reflect-metadata';
import { IUserController } from '../interfaces/controller';
import { UserLoginDto } from './dto/user-login.dto';
import { UserRegisterDto } from './dto/user-register.dto';
import { IUserService } from './services/user.service.interface';
import { HTTPError } from '../services/error.service';
import { ValidateMiddleware } from '../common/validate.middleware';
import { sign } from 'jsonwebtoken';
import { IConfigService } from '../config/config.service.interface';
import { EnvKeyFor } from '../constants/config';
import { GuardMiddleware } from '../common/guard.middleware';

@injectable()
export class UserController extends BaseController implements IUserController {
  private basePath = '/user';

  constructor(
    @inject(TYPES.ILogger) private loggerService: ILogger,
    @inject(TYPES.UserService) private userService: IUserService,
    @inject(TYPES.ConfigService) private configService: IConfigService,
  ) {
    super({ logger: loggerService });
    this.bindRoutes(
      [
        {
          path: '/login',
          method: 'post',
          handler: this.login,
          middlewares: [new ValidateMiddleware(UserLoginDto)],
        },
        {
          path: '/register',
          method: 'post',
          handler: this.register,
          middlewares: [new ValidateMiddleware(UserRegisterDto)],
        },
        {
          path: '/info',
          method: 'get',
          handler: this.info,
          middlewares: [new GuardMiddleware()],
        },
      ],
      this.basePath,
    );
  }

  public login = async (
    { body }: Request<unknown, unknown, UserLoginDto>,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const isValid = await this.userService.ensureIsValid(body);

    if (isValid) {
      const jwt = await this.signJWT(body.email, this.configService.get(EnvKeyFor.SECRET));
      res.status(200).send({ jwt });
      this.loggerService.log('[user login] successful');
    } else {
      res.status(401).send(`неверный логин или пароль`);
      this.loggerService.log('[user login] unsuccessful');
    }

    next();
  };

  public register = async (
    { body }: Request<unknown, unknown, UserRegisterDto>,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const newcommer = await this.userService.createUser(body);

    if (!newcommer) {
      this.loggerService.log(`[user register] unsuccessfull: User ${body.name} ${body.email}`);
      return next(new HTTPError({ status: 422, message: 'Похоже пользователь уже существует' }));
    }

    res.status(200).send(newcommer);
    next();
  };

  public info = async ({ user }: Request, res: Response, next: NextFunction): Promise<void> => {
    this.loggerService.log('[user info] should return email if worked');

    const registeredUser = await this.userService.getUser(user);
    this.loggerService.log(`[user info] ${registeredUser}`);
    if (registeredUser) {
      res.status(200).send({ id: registeredUser.id, email: registeredUser.email });
    } else {
      next(new HTTPError({ status: 401, message: 'Доступ запрещен' }));
    }
  };

  private signJWT(email: string, secret: string): Promise<string> {
    return new Promise((resolve, reject) => {
      sign(
        { email, iat: Math.floor(Date.now() - 1000) },
        secret,
        { algorithm: 'HS256' },
        (error, token) => {
          if (token) {
            resolve(token);
          }

          reject(error);
        },
      );
    });
  }
}
