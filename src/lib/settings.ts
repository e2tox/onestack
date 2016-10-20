import { LogLevel } from './log';

export interface IBasicSettings {
  NAME: string,
  VERSION: string,
  ENV: string,
  HOME_DIR: string,
  LOG_DIR: string,
  LOG_CONSOLE: boolean,
  LOG_CONSOLE_LEVEL: LogLevel,
  LOG_FILE: boolean,
  LOG_FILE_LEVEL: LogLevel,
  LOG_FILE_ROTATE_PERIOD: string,
  LOG_FILE_ROTATE_MAX: number
}
