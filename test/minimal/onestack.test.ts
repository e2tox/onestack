import * as path from 'path'
import { Kernel, onestack } from '../../src/lib'
import { IBasicSettings } from '../../src/lib/settings';
declare var __dirname: string;

describe('OneStack - Minimal Tests', () => {
  
  let testRoot: string;
  let kernel: Kernel<IBasicSettings>;
  let kernel2: Kernel<IBasicSettings>;
  
  beforeAll(() => {
    testRoot = path.resolve(__dirname);
    
  });
  
  describe('#init', () => {
    
    it('should get same instance', () => {
      kernel = onestack<IBasicSettings>();
      kernel2 = onestack<IBasicSettings>();
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
