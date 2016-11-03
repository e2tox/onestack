import { LogLevel } from './log';

export interface IKernelSettings {
  NAME: string,
  VERSION: string,
  ENV: string,
  PRINT_SETTINGS: boolean,
  AUTO_CREATE_DIRECTORY: boolean,
  HOME_DIR: string,
  LOG_DIR: string,
  LOG_CONSOLE: boolean,
  LOG_CONSOLE_LEVEL: string | LogLevel,
  LOG_ROTATE: boolean,
  LOG_ROTATE_LEVEL: string,
  LOG_ROTATE_PERIOD: string,
  LOG_ROTATE_MAX: number
}
