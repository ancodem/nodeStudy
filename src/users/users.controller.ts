import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { BaseController } from '../controllers/base.controller';
import { ILogger } from '../interfaces/logger';
import { TYPES } from '../types';
import 'reflect-metadata';
import { IUserController } from '../interfaces/controller';
import { UserLoginDto } from './dto/user-login.dto';
import { UserRegisterDto } from './dto/user-register.dto';

@injectable()
export class UsersController extends BaseController implements IUserController {
	private basePath = '/user';

	constructor(@inject(TYPES.ILogger) private loggerService: ILogger) {
		super({ logger: loggerService });
		this.bindRoutes(
			[
				{ path: '/login', method: 'post', handler: this.login },
				{ path: '/register', method: 'post', handler: this.register },
			],
			this.basePath,
		);
	}

	public login = (
		req: Request<unknown, unknown, UserLoginDto>,
		res: Response,
		next: NextFunction,
	): void => {
		this.loggerService.log('Обработчик рута users');
		console.info('req body', req.body);
		res.status(200).send('вы успешно залогинились');
		next();
	};

	public register = (
		_req: Request<unknown, unknown, UserRegisterDto>,
		res: Response,
		next: NextFunction,
	): void => {
		res.status(200).send('вы успешно зарегистрировались');
		next();
	};
}
