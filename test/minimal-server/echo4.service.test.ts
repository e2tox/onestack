import { EchoServiceClient } from './sdk/echo.service.client';
import { Engine } from '../../src/lib/engine';
import { IEngineSettings } from '../../src/lib/engineSettings';
import { EchoService } from './services/echo.service';
import * as path from 'path';
import { Echo2Service } from './services/echo2.service';
import { Echo3Service } from './services/echo3.service';
import { PassThrough } from 'stream';
import { Echo4Service } from './services/echo4.service';

describe('echo4 service', () => {

  let testRoot: string;

  beforeAll(() => {
    // resolve from process.cwd()
    testRoot = path.resolve('test/minimal-server');
  });

  describe('client', () => {

    let originalTimeout;
    let engine: Engine<IEngineSettings>;

    beforeEach(() => {
      originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
      engine = new Engine({ root: testRoot });
    });

    afterEach(() => {
      engine.stop();
      engine.dispose(true);
      engine = null;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
    });

    it('echo client stream', (done) => {

      engine.addService(Echo4Service, testRoot);
      engine.start();

      const client = new EchoServiceClient(engine.port);

      const req = new PassThrough({ objectMode: true });

      for (let n1 = 1; n1 < 10; n1++) {
        req.write({ content: `Pre cached Stream ${n1}` });
      }
      
      const res = client.echoBidiStream(req);
        // console.log('set max to 12')
        // stream.setMaxListeners(12);

        res.on('data', function (res: any) {
          console.log('client stream', res);
        });

        res.on('end', function () {
          console.log('client stream end');
          done();
        });
      
      for (let n2 = 10; n2 < 20; n2++) {
        req.write({ content: `After Client Stream ${n2}` });
      }
      
      req.end();
    });
  });

});
