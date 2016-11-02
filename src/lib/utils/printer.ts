import { ILogger } from '../log';

export class Printer {

  static print(settings: any, logger: ILogger): void {

    logger.info('Active configuration properties:');
    Object.getOwnPropertyNames(settings).map(key => {
      return {
        key: key,
        value: this.sensitive(key) ? this.mask(settings[key]) : settings[key]
      }
    }).forEach(pair => {
      logger.info(pair.key, '=', pair.value);
    });

  }

  static sensitive(key: string) {
    const test = key.toUpperCase();
    return test.endsWith('_KEY') || test.endsWith('_PASSWORD') || test.endsWith('_SECRET');
  }

  static mask(value) {
    let masked = '';
    for (let idx = 0; idx < value.length; idx++) {
      if (idx < 2 || idx > value.length - 3) {
        masked += value[idx];
      }
      else {
        masked += '*';
      }
    }
    return masked;
  }
}
