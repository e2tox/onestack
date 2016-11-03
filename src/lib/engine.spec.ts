import { Engine } from './engine';
import * as path from 'path';
import { EchoService } from '../../test/minimal-server/services/echo.service';

describe('server', () => {

  let testRoot: string;

  beforeAll(() => {
    // resolve from process.cwd()
    testRoot = path.resolve('test/minimal-server');
  });

  describe('# should able to', () => {

    it('start / stop', () => {
      const engine = new Engine({ root: testRoot });
      engine.start();
      engine.stop();
      engine.dispose(true);
    });

    it('add service', () => {
      const engine = new Engine({ root: testRoot });
      engine.addService(EchoService, testRoot);
      engine.start();
      engine.stop();
      engine.dispose(true);
    })

  });

});
