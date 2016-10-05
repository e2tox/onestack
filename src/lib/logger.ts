import { LogLevel } from './log'

const dev = process.env.NODE_ENV !== 'production';

export function debug(message: string): void {
  if (dev) {
    console.log(message);
  }
}

export function error(message: string): void {
  console.error(message);
}

export class Logger {

  private level: number;

  constructor() {
    this.level = 1;
  }

  log(code: string, level: LogLevel, message: string, context?: any) {
    console.log(message);
  }

}
