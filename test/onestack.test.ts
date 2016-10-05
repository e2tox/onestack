import * as path from 'path'
import app from '../src/lib'

describe('OneStack', () => {

  describe('#init', () => {

    it('should not able to init on non-existing directory', () => {
      expect(function () {
        app.init('/not-exist-directory')
      }).toThrow();
    });

    it('should init to __dirname', () => {
      app.init(__dirname)
    });

    it('should not able to init again', () => {
      expect(function () {
        app.init(__dirname)
      }).toThrow();
    });

    it('should able to resolve conf dir from root', () => {
      expect(app.root.path).toBe(__dirname);
    });

    it('should able to resolve conf dir', () => {
      expect(app.resolve('conf').path).toBe(path.resolve(__dirname, 'conf'));
    });

    it('should throw ENOENT for non-exists folders', () => {
      expect(function () {
        app.resolve('folder-not-exist')
      }).toThrow();
    });

    it('should throw error when resolve to file', () => {
      expect(function () {
        app.resolve('file.txt')
      }).toThrow();
    });

    it('should throw error when resolve absolute path', () => {
      expect(function () {
        app.resolve('/root')
      }).toThrow();
    });

  });

});
