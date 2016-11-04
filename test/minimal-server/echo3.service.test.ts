import { EchoServiceClient } from './sdk/echo.service.client';
import { Engine } from '../../src/lib/engine';
import { IEngineSettings } from '../../src/lib/engineSettings';
import * as path from 'path';
import { PassThrough } from 'stream';
import { Echo3Service } from './services/echo3.service';

describe('echo3 service', () => {

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

    it('echoClientStream response error', (done) => {

      engine.addService(Echo3Service, testRoot);
      engine.start();

      const client = new EchoServiceClient(engine.port);

      const req = new PassThrough({ objectMode: true });

      for (let n1 = 1; n1 < 10; n1++) {
        req.write({ content: `Pre cached Stream ${n1}` });
      }
      req.end();

      client.echoClientStream(req).then(result => {
        console.log('got result from echoClientStream', result);
        expect(result).toBeUndefined();
        done();
      }).catch(err => {
        console.log('got error from echoClientStream', err);
        expect(err).toBeDefined();
        done();
      });

    });

    it('echoClientStream request error', () => {

      engine.addService(Echo3Service, testRoot);
      engine.start();

      const client = new EchoServiceClient(engine.port);

      expect(() => {
        client.echoClientStream(null);
      }).toThrowError('Argument null is not readable stream')

    });

  });

});
