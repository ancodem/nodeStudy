import { injectable } from 'inversify';
import { Logger as TsLogger } from 'tslog';
import { ILogger } from '../interfaces/logger';
import 'reflect-metadata';

@injectable()
export class LoggerService implements ILogger {
  public logger: TsLogger<unknown>;

  constructor() {
    this.logger = new TsLogger();
  }

  log(...args: unknown[]): void {
    this.logger.info(...args);
  }

  error(...args: unknown[]): void {
    this.logger.error(...args);
  }

  wart(...args: unknown[]): void {
    this.logger.warn(...args);
  }
}
