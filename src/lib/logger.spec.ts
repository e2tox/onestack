import * as path from 'path';
import { Kernel } from './kernel';
import { ILogger } from './log';

describe('Logger', () => {

  let testRoot: string;

  beforeAll(() => {
    // resolve from process.cwd()
    testRoot = path.resolve('test/full_customized');
  });

  describe('# should able to', () => {

    let logger: ILogger;

    beforeAll(() => {
      const kernel = new Kernel();
      kernel.init({ root: testRoot });
      logger = kernel.logger;
    });

    it('log empty message', () => {
      logger.trace('');
      logger.debug('');
      logger.info('');
      logger.warn('');
      logger.error('');
      logger.fatal('');
    });

    it('log message', () => {
      logger.trace('this is trace');
      logger.debug('this is debug');
      logger.info('this is info');
      logger.warn('this is warn');
      logger.error('this is error');
      logger.fatal('this is fatal');
    });

    it('log multi-line message', () => {
      logger.trace('this is trace\nsecond trace');
      logger.debug('this is debug\nsecond debug');
      logger.info('this is info\nsecond info');
      logger.warn('this is warn\nsecond warn');
      logger.error('this is error\nsecond error');
      logger.fatal('this is fatal\nsecond fatal');
    });

    it('log custom time', () => {
      logger.info(
        {
          time: Date.now(),
          nothing: undefined,
          nullable: null,
          empty: '',
          people: { name: 'name', age: 12 },
          text: 'bio test abc 中文',
          text2: '中文',
          memo: 'multi-line\nsecond line',
          memo2: 'multi-line\nsecond line'
        },
        'this is info'
      );
    });

    it('log empty time', () => {
      logger.info({
        time: ' '
      },
        'this is info'
      );
    });

  });

});
