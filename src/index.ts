import express, { Request, Response } from "express";
import userRouter from "./users/routes.js";

const PORT = 8080;

const app = express();

app.use((_req, _resp, next) => {
  console.log("промежуточный обработчкие");
  next();
});

app.use("/users", userRouter);

app.get("/hello", (_req: Request, res: Response) => {
  res.send("this is a reply");
});

app.listen(PORT, () => {
  console.log(`Сервер запущен на http://.localhost:${PORT}`);
});
