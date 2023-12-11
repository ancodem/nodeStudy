import { App } from "./app";
import { ErrorHandler } from "./services/error.service";
import { Logger } from "./services/logger.service";
import { userController } from "./users/routes";

async function bootstrap() {
  const app: App = new App({ port: 8080, logger: Logger });
  app.addRoutes([userController]);
  app.addErrorHandlers([new ErrorHandler(Logger).catch]);

  await app.init();
}

bootstrap();
