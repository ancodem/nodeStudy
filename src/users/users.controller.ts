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
export class UsersController extends BaseController implements IUserController {
  private basePath = '/user';

  constructor(
    @inject(TYPES.ILogger) private loggerService: ILogger,
    @inject(TYPES.UserService) private userService: IUserService,
  ) {
    super({ logger: loggerService });
    this.bindRoutes(
      [
        { path: '/login', method: 'post', handler: this.login },
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

  public login = (
    { body }: Request<unknown, unknown, UserLoginDto>,
    res: Response,
    next: NextFunction,
  ): void => {
    this.loggerService.log('Обработчик рута users');
    console.info('req body', body);
    res.status(200).send(`вы успешно залогинились с данными ${JSON.stringify(body)}`);
    next();
  };

  public register = async (
    { body }: Request<unknown, unknown, UserRegisterDto>,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const newcommer = await this.userService.createUser(body);
    if (!newcommer) {
      return next(new HTTPError({ status: 422, message: 'Похоже пользователь уже существует' }));
    }
    res.status(200).send(newcommer);
    next();
  };
}
