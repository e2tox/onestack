import * as path from 'path'
import kernel from './config'
import kernel2 from './config'

declare var __dirname: string;

describe('OneStack - Minimal Tests', () => {

  let testRoot: string;

  beforeAll(() => {
    testRoot = path.resolve(__dirname);

  });

  describe('#init', () => {

    it('should get same instance', () => {
      expect(kernel).toEqual(kernel2);
    });

    it('should init to __dirname', () => {
      expect(() => {
        kernel.init()
      }).toThrowError(`Directory '${process.cwd()}/conf' is not exist`);
    });

    it('should init to __dirname', () => {
      kernel.init({ root: testRoot })
    });

    it('should not able to init again', () => {
      expect(function () {
        kernel.init(testRoot)
      }).toThrowError('OneStack already initialized');
    });

    it('should able to resolve conf dir from root', () => {
      expect(kernel.root.path).toBe(testRoot);
    });

    it('should able to resolve conf dir', () => {
      expect(kernel.resolve('conf').path).toBe(path.resolve(testRoot, 'conf'));
    });

    it('should able to get logger', () => {
      expect(kernel.logger).toBeDefined();
    });

  });

});
