import { EchoServiceClient } from './sdk/echo.service.client';
import { Engine } from '../../src/lib/engine';
import { IEngineSettings } from '../../src/lib/engineSettings';
import * as path from 'path';
import { Echo4Service } from './services/echo4.service';
import { Duplex } from 'stream';
import { PassThrough } from 'stream';

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

    it('echo client stream using another stream', (done) => {

      engine.addService(Echo4Service, testRoot);
      engine.start();

      const client = new EchoServiceClient(engine.port);
      const req = new PassThrough({ objectMode: true });

      for (let n2 = 10; n2 < 20; n2++) {
        req.write({ content: `Client Stream ${n2}` });
      }

      req.end();

      const res = client.echoBidiStream(req) as Duplex;
      // console.log('set max to 12')
      // stream.setMaxListeners(12);

      res.on('data', function (res: any) {
        console.log('client stream', res);
      });

      res.on('end', function () {
        console.log('client stream end');
        done();
      });

    });

    it('echo client stream using another stream', (done) => {

      engine.addService(Echo4Service, testRoot);
      engine.start();

      const client = new EchoServiceClient(engine.port);

      const res = client.echoBidiStream(undefined) as Duplex;
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
        res.write({ content: `After Client Stream ${n2}` });
      }

      res.end();

    });
  });

});
