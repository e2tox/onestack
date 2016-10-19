import * as path from 'path'
import { Kernel } from '../../src/lib/kernel'

describe('TEST: invalidate-package-json-file', () => {

  let testRoot: string;

  beforeAll(() => {
    // resolve from process.cwd()
    testRoot = path.resolve(__dirname);
  });

  it('should able to init() by ignore package json error', () => {
    const kernel = new Kernel();
    kernel.init({ root: testRoot });
  });

});
