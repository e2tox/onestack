import * as path from 'path'
import { Kernel } from '../../src/lib/kernel'

describe('TEST: missing-settings', () => {

  let testRoot: string;

  beforeAll(() => {
    // resolve from process.cwd()
    testRoot = path.resolve(__dirname);
  });

  it('should able to init()', () => {
    const kernel = new Kernel();
    kernel.init({ root: testRoot });
  });

});
