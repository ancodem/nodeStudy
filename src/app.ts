import express, { Express, Router } from "express";
import { Server } from "http";

export class App {
  private app: Express;
  private port: number;
  // @ts-ignore
  private server: Server;
  private routeHandlers: Record<string, Router> = {};

  constructor(port: number) {
    this.app = express();
    this.port = port;
  }

  public async init() {
    this.applyRouteHandlers();
    this.server = this.app.listen(this.port);
    console.log(`Сервер запущен на http://.localhost:${this.port}`);
  }

  public addRouteHandlers(handlers: Record<string, Router>) {
    this.routeHandlers = { ...this.routeHandlers, ...handlers };
  }

  public addMiddleWare(middleWare: Router | Router[]) {
    this.app.use(middleWare);
  }

  private applyRouteHandlers() {
    for (const [path, routeHandler] of Object.entries(this.routeHandlers)) {
      this.app.use(path, routeHandler);
    }
  }
}
