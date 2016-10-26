import { LogLevel } from './log';

export interface IBasicSettings {
  NAME: string,
  VERSION: string,
  ENV: string,
  HOME_DIR: string,
  LOG_DIR: string,
  LOG_CONSOLE: boolean,
  LOG_CONSOLE_LEVEL: LogLevel,
  LOG_ROTATE: boolean,
  LOG_ROTATE_LEVEL: LogLevel,
  LOG_ROTATE_PERIOD: string,
  LOG_ROTATE_MAX: number
}
