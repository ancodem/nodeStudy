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
import { IUserService } from '../services/user.service.interface';
import { HTTPError } from '../services/error.service';
import { ValidateMiddleware } from '../common/validate.middleware';

@injectable()
export class UserController extends BaseController implements IUserController {
  private basePath = '/user';

  constructor(
    @inject(TYPES.ILogger) private loggerService: ILogger,
    @inject(TYPES.UserService) private userService: IUserService,
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
      res.status(200).send(`вы успешно залогинились с данными ${JSON.stringify(body)}`);
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
    this.loggerService.log(`[user register] successfull: User ${body.name} ${body.email}`);
    res.status(200).send(newcommer);
    next();
  };
}
