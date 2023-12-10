import { Logger as TsLogger } from "tslog";

export class LoggerService {
  public logger: TsLogger<unknown>;

  constructor(logger: TsLogger<unknown>) {
    this.logger = logger;
  }

  log(...args: unknown[]) {
    this.logger.info(...args);
  }

  error(...args: unknown[]) {
    this.logger.error(...args);
  }

  wart(...args: unknown[]) {
    this.logger.warn(...args);
  }
}

export const Logger = new LoggerService(new TsLogger());
