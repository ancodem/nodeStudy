import express, { NextFunction, Response, Request } from "express";

const userRouter = express.Router();

userRouter.use((_req, _res, next) => {
  console.log("Обработчик рута users");
  next();
});

userRouter.post("/login", (_req, res) => {
  res.send("это рут логина");
});

userRouter.get("/login", (_req, _res) => {
  throw new Error("низя взять то, что не положил");
});

userRouter.post("/register", (_req, res) => {
  res.send("это рут регистрации");
});

userRouter.use(
  (err: Error, _req: Request, res: Response, _next: NextFunction) => {
    console.error(err.message);
    res.status(404).send("шота пошло не так");
  },
);

export default userRouter;
