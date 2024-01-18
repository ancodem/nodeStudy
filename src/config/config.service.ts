import { DotenvParseOutput, config } from 'dotenv';
import { IConfigService } from './config.service.interface';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import { ILogger } from '../interfaces/logger';
import { EnvKeyFor } from '../constants/config';

export type EnvKey = (typeof EnvKeyFor)[keyof typeof EnvKeyFor];

@injectable()
export class ConfigService implements IConfigService {
  private config: DotenvParseOutput;

  constructor(@inject(TYPES.ILogger) private logger: ILogger) {
    const output = config();

    if (output.error) {
      this.logger.error('[ConfigService] Не удалось получить данные о переменных окружения');
    } else {
      this.logger.log('[ConfigService] Конфигурация .env загружена');
      this.config = output.parsed as DotenvParseOutput;
    }
  }

  get(key: EnvKey): string {
    return this.config[key];
  }
}
