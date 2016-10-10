import * as path from 'path'
import { Kernel } from '../../src/lib/kernel'

describe('full_customized', () => {
  
  let testRoot: string;
  
  beforeAll(() => {
    // resolve from process.cwd()
    testRoot = path.resolve('test/full_customized');
    console.error('full_customized')
  });
  
  it('should contains PORT number from full customized settings', () => {
    const kernel = new Kernel();
    kernel.init(testRoot);
    expect(kernel.settings).toBeDefined();
    expect(kernel.settings['PORT']).toBe(11023);
  });
  
  it('should able to get settings', () => {
    const kernel = new Kernel();
    kernel.init(testRoot);
    expect(kernel.get('PORT')).toBe(11023);
  });
  
  it('should throw error', () => {
    const kernel = new Kernel();
    kernel.init(testRoot);
    expect(() => {
      kernel.get('NOT_EXISTS_KEY')
    }).toThrowError();
  });
  
  it('should return true', () => {
    const kernel = new Kernel();
    kernel.init(testRoot);
    expect(kernel.has('PORT')).toBe(true);
  });
  
});
