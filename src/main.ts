import { Container, ContainerModule } from 'inversify';
import { App } from './app';
import { IUserController } from './interfaces/controller';
import { IErrorHandler } from './interfaces/errorHandler';
import { ILogger } from './interfaces/logger';
import { ErrorHandler } from './services/error.service';
import { LoggerService } from './services/logger.service';
import { TYPES } from './types';
import { UserController } from './users/users.controller';
import { IUserService } from './services/user.service.interface';
import { UserService } from './services/user.service';
import { IConfigService } from './config/config.service.interface';
import { ConfigService } from './config/config.service';
import { PrismaService } from './database/prisma.service';
import { IUserRepository } from './users/repository/user.repository.interface';
import { UserRepository } from './users/repository/user.repository';

interface IBootstrapReturn {
  app: App;
  appContainer: Container;
}

const appModules = new ContainerModule((bind) => {
  bind<ILogger>(TYPES.ILogger).to(LoggerService).inSingletonScope();
  bind<IConfigService>(TYPES.ConfigService).to(ConfigService).inSingletonScope();
  bind<PrismaService>(TYPES.PrismaService).to(PrismaService).inSingletonScope();
  bind<IUserRepository>(TYPES.UserRepository).to(UserRepository).inSingletonScope();
  bind<IErrorHandler>(TYPES.ErrorHandler).to(ErrorHandler);
  bind<IUserController>(TYPES.UserController).to(UserController);
  bind<IUserService>(TYPES.UserService).to(UserService);
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
