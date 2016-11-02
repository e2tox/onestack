import * as bunyan from 'bunyan'
import * as path from 'path'
import { ILogger } from '../log'
import { IKernelSettings } from '../kernelSettings';
import { ConsoleTransformer } from './console';

export class Logger {

  /**
   * Create master logger from settings
   * @param settings
   * @returns {Logger}
   */
  public static createFromSettings(settings: IKernelSettings): ILogger {

    const options = {
      name: settings.NAME,
      streams: [],
      serializers: {
        err: bunyan.stdSerializers.err,
        res: bunyan.stdSerializers.res,
        req: bunyan.stdSerializers.req
      }
    };

    // always log to stderr for errors
    if (!!settings.LOG_CONSOLE) {
      options.streams.push({
        level: settings.LOG_CONSOLE_LEVEL,
        stream: new ConsoleTransformer()
      });
    }

    if (!!settings.LOG_ROTATE) {
      options.streams.push({
        type: 'rotating-file',
        level: settings.LOG_ROTATE_LEVEL,
        path: path.join(settings.LOG_DIR, 'rotate.log'),
        period: settings.LOG_ROTATE_PERIOD,
        count: settings.LOG_ROTATE_MAX
      })
    }

    return bunyan.createLogger(options);
  }

}
