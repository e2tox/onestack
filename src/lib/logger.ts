import * as bunyan from 'bunyan'
import * as path from 'path'
import { LogLevel, ILogger } from './log'
import { IBasicSettings } from './settings';

export class Logger {

  /**
   * Create master logger from settings
   * @param settings
   * @returns {Logger}
   */
  public static createFromSettings(settings: IBasicSettings): ILogger {

    const options = {
      name: settings.NAME,
      streams: [],
      serializers: bunyan.stdSerializers
    };

    // always log to stderr for errors
    if (!!settings.LOG_CONSOLE) {
      options.streams.push({
        level: settings.LOG_CONSOLE_LEVEL,
        stream: process.stdout
      });
      options.streams.push({
        level: LogLevel.Error,
        stream: process.stderr
      });
    }

    if (!!settings.LOG_FILE) {
      options.streams.push({
        type: 'rotating-file',
        level: settings.LOG_FILE_LEVEL,
        path: path.join(settings.LOG_DIR, 'app.log'),
        period: settings.LOG_FILE_ROTATE_PERIOD,
        count: settings.LOG_FILE_ROTATE_MAX
      })
    }

    return bunyan.createLogger(options);
  }

}
