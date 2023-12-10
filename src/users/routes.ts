import { NextFunction, Response, Request } from "express";
import { Logger } from "../services/logger.service";
import { UsersController } from "./users.controller";

export const userController = new UsersController({
  routes: [
    {
      path: "/login",
      handler: (_req: Request, _res: Response, next: NextFunction) => {
        console.log("Обработчик рута users");
        next();
      },
      method: "all",
    },
    {
      path: "/login",
      handler: (_req: Request, res: Response, _next: NextFunction) => {
        res.send("это рут логина");
      },
      method: "post",
    },
    {
      path: "/login",
      handler: (_req: Request, _res: Response, _next: NextFunction) => {
        throw new Error("низя взять то, что не положил");
      },
      method: "get",
    },
    {
      path: "/register",
      handler: (_req: Request, res: Response, _next: NextFunction) => {
        res.send("это рут регистрации");
      },
      method: "post",
    },
    {
      path: "/register",
      handler: (
        err: Error,
        _req: Request,
        res: Response,
        _next: NextFunction,
      ) => {
        console.error(err.message);
        res.status(404).send("шота пошло не так");
      },
      method: "use",
    },
  ],
  logger: Logger,
});
