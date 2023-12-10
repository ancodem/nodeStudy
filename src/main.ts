import { App } from "./app";
import { Logger } from "./services/logger.service";
import { userController } from "./users/routes";

async function bootstrap() {
  const app: App = new App({ port: 8080, logger: Logger });
  app.addRoutes([userController]);

  await app.init();
}

bootstrap();
