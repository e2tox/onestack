import * as path from 'path'
import app from '../../src/lib'

describe('TEST: only-default', () => {

  let testRoot: string;

  beforeAll(() => {
    // resolve from process.cwd()
    testRoot = path.resolve(__dirname);
  });

  it('should not able to init()', () => {
    expect(() => {
      app.init({ root: testRoot })
    }).toThrowError('OneStack already initialized');

  });

});
