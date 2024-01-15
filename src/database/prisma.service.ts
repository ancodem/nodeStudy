import { PrismaClient } from '@prisma/client';
import { inject, injectable } from 'inversify';
import { ILogger } from '../interfaces/logger';
import { TYPES } from '../types';

@injectable()
export class PrismaService {
  public client;

  constructor(@inject(TYPES.ILogger) private logger: ILogger) {
    this.client = new PrismaClient();
  }

  public async connect(): Promise<void> {
    try {
      await this.client.$connect();
      this.logger.log('[database] connection successfull');
    } catch (err) {
      if (err instanceof Error) {
        this.logger.error(`[database] failed to connect... Error: ${err.message}`);
      }
    }
  }

  public async disconnect(): Promise<void> {
    try {
      await this.client.$disconnect();
      this.logger.log('[database] disconnected successfully');
    } catch (err) {
      if (err instanceof Error) {
        this.logger.error(`[database] failed to disconnect... Error: ${err.message}`);
      }
    }
  }
}
