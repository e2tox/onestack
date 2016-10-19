import * as path from 'path'
import { Kernel } from '../../src/lib/kernel'

describe('TEST: missing-directory', () => {

  let testRoot: string;

  beforeAll(() => {
    // resolve from process.cwd()
    testRoot = path.resolve(__dirname);
  });

  it('should not able to init()', () => {
    const kernel = new Kernel();
    expect(() => {
      kernel.init({ root: testRoot, autoCreateDir: false });
    }).toThrowError(`Directory '${testRoot}/data' is not exist`)
  });

});
