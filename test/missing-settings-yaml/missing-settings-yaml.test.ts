import * as path from 'path'
import { Kernel } from '../../src/lib/kernel'

describe('TEST: missing-settings-yaml', () => {
  
  let testRoot: string;
  
  beforeAll(() => {
    // resolve from process.cwd()
    testRoot = path.resolve(__dirname);
  });
  
  it('should able to init()', () => {
    const kernel = new Kernel();
    expect(()=> {
      kernel.init({ root: testRoot });
    }).toThrowError(`Directory '${testRoot}/conf' is not exist`);
  });
  
});
