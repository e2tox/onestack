import * as path from 'path'
import app from '../../src/lib'
declare var __dirname: string;

describe('OneStack - Minimal Tests', () => {

  let testRoot: string;

  beforeAll(() => {
    testRoot = path.resolve(__dirname);
  });

  describe('#init', () => {
    
    it('should init to __dirname', () => {
      expect(()=>{
        app.init()
      }).toThrowError(`Directory '${process.cwd()}/conf' is not exist`);
    });
    
    it('should init to __dirname', () => {
      app.init({ root: testRoot })
    });

    it('should not able to init again', () => {
      expect(function () {
        app.init(testRoot)
      }).toThrowError('OneStack already initialized');
    });

    it('should able to resolve conf dir from root', () => {
      expect(app.root.path).toBe(testRoot);
    });

    it('should able to resolve conf dir', () => {
      expect(app.resolve('conf').path).toBe(path.resolve(testRoot, 'conf'));
    });

  });

});
