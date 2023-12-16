import { Container, ContainerModule } from 'inversify';
import { App } from './app';
import { IUserController } from './interfaces/controller';
import { IErrorHandler } from './interfaces/errorHandler';
import { ILogger } from './interfaces/logger';
import { ErrorHandler } from './services/error.service';
import { LoggerService } from './services/logger.service';
import { TYPES } from './types';
import { UsersController } from './users/users.controller';

interface IBootstrapReturn {
	app: App;
	appContainer: Container;
}

const appModules = new ContainerModule((bind) => {
	bind<ILogger>(TYPES.ILogger).to(LoggerService);
	bind<IErrorHandler>(TYPES.ErrorHandler).to(ErrorHandler);
	bind<IUserController>(TYPES.UserController).to(UsersController);
	bind<App>(TYPES.Application).to(App);
});

function bootstrap(): IBootstrapReturn {
	const appContainer = new Container();
	appContainer.load(appModules);
	const app = appContainer.get<App>(TYPES.Application);

	app.init();
	return { app, appContainer };
}

export const { app, appContainer } = bootstrap();
