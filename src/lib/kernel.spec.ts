import * as path from 'path'
import { Kernel } from './kernel'

describe('Kernel', () => {
  
  let testRoot: string;
  
  beforeAll(() => {
    // resolve from process.cwd()
    testRoot = path.resolve('test/minimal');
  });
  

  describe('# not allow to', () => {
    
    it('call kernel.init() twice', () => {
      const kernel = new Kernel();
      kernel.init(testRoot);
      expect(() => {
        kernel.init(testRoot);
        console.error('[YOU SHOULD NEVER SEE THIS]');
      }).toThrow(new TypeError('OneStack already initialized'));
    });
    
    it('call kernel.init(\'/not-exist-directory\')', () => {
      const kernel = new Kernel();
      expect(() => {
        kernel.init('/not-exist-directory');
        console.error('[YOU SHOULD NEVER SEE THIS]');
      }).toThrow(new Error(`Directory '/not-exist-directory' is not exist`))
    });
    
    it('call kernel.root before kernel.init()', () => {
      const kernel = new Kernel();
      expect(() => {
        const root = kernel.root;
        console.error('[YOU SHOULD NEVER SEE THIS]', root);
      }).toThrow(new TypeError('OneStack not initialized. Please call init() first!'))
    });
    
    it('call kernel.resolve(path) before kernel.init()', () => {
      const kernel = new Kernel();
      expect(() => {
        const resolved = kernel.resolve('test');
        console.error('[YOU SHOULD NEVER SEE THIS]', resolved);
      }).toThrow(new TypeError('OneStack not initialized. Please call init() first!'))
    });
    
    it('call kernel.resolve() before kernel.init()', () => {
      const kernel = new Kernel();
      expect(() => {
        const resolved = kernel.resolve();
        console.error('[YOU SHOULD NEVER SEE THIS]', resolved);
      }).toThrow(new TypeError('OneStack not initialized. Please call init() first!'))
    });
    
  });
  
  describe('# should able to', () => {
    
    it('call init()', () => {
      const kernel = new Kernel();
      kernel.init(testRoot)
    });
    
    it('call kernel.root after init()', () => {
      const kernel = new Kernel();
      kernel.init(testRoot);
      expect(kernel.root).toBeDefined();
      expect(kernel.root.path).toBe(testRoot);
    });
    
    it('call kernel.resolve() after init()', () => {
      const kernel = new Kernel();
      kernel.init(testRoot);
      expect(kernel.resolve()).toBeDefined();
      expect(kernel.resolve().path).toBe(testRoot);
    });
    
    it('call kernel.resolve(\'conf\') after init()', () => {
      const kernel = new Kernel();
      kernel.init(testRoot);
      expect(kernel.resolve('conf')).toBeDefined();
      expect(kernel.resolve('conf').path).toBe(path.join(testRoot, 'conf'));
    });
    
  });
  
});
