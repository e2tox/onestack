import * as path from 'path'
import { Kernel } from '../../src/lib/kernel'

describe('full_customized', () => {

  let testRoot: string;

  beforeAll(() => {
    // resolve from process.cwd()
    testRoot = path.resolve(__dirname);
  });

  it('should contains PORT number from full customized settings', () => {
    const kernel = new Kernel();
    kernel.init({ root: testRoot });
    expect(kernel.settings).toBeDefined();
    expect(kernel.settings.PORT).toBe(11023);
  });

  it('should able to get settings', () => {
    const kernel = new Kernel();
    kernel.init({ root: testRoot });
    expect(kernel.get('PORT')).toBe(11023);
  });

  it('should throw error', () => {
    const kernel = new Kernel();
    kernel.init({ root: testRoot });
    expect(() => {
      kernel.get('NOT_EXISTS_KEY')
    }).toThrowError();
  });

  it('should return true', () => {
    const kernel = new Kernel();
    kernel.init({ root: testRoot });
    expect(kernel.has('PORT')).toBe(true);
  });

  it('should able to log error', () => {
    const kernel = new Kernel();
    kernel.init({ root: testRoot });
    kernel.logger.error(new Error('error'));
  });

  it('should able to log to console', () => {
    const kernel = new Kernel();
    kernel.init({ root: testRoot });
    kernel.logger.warn('this is a warn log');
  });

});
