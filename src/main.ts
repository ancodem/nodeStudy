import express from "express";
import { App } from "./app";
import userRouter from "./users/routes";

async function bootstrap() {
  const app: App = new App(8080);
  app.addRouteHandlers({
    "/users": userRouter,
  });
  await app.init();
}

bootstrap();
