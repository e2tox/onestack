import * as path from 'path'
import app from '../../src/lib'

describe('OneStack', () => {

  describe('#init', () => {

    it('should not able to init on non-existing directory', () => {
      expect(function () {
        app.init({ root: '/not-exist-directory' })
      }).toThrowError(`Directory '/not-exist-directory' is not exist`);
    });

    it('should not able to init at root folder', () => {
      expect(function () {
        app.init();
      }).toThrowError(`Directory '${process.cwd()}/conf' is not exist`);
    });

    it('should init to __dirname', () => {
      app.init({ root: __dirname })
    });

    it('should not able to init again', () => {
      expect(function () {
        app.init(__dirname)
      }).toThrowError('OneStack already initialized');
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
      }).toThrowError(`Directory '${__dirname}/folder-not-exist' is not exist`);
    });

    it('should throw error when resolve to file', () => {
      expect(function () {
        app.resolve('conf/settings.xml')
      }).toThrowError(`Directory '${__dirname}/conf/settings.xml' is not exist`);
    });

    it('should throw error when resolve absolute path', () => {
      expect(function () {
        app.resolve('/root')
      }).toThrowError(`'/root' is not a relative path`);
    });

  });

});
