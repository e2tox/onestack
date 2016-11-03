import { EchoServiceClient } from './sdk/echo.service.client';
import { Engine } from '../../src/lib/engine';
import { IEngineSettings } from '../../src/lib/engineSettings';
import { EchoService } from './services/echo.service';
import * as path from 'path';

describe('engine', () => {

  let testRoot: string;

  beforeAll(() => {
    // resolve from process.cwd()
    testRoot = path.resolve('test/minimal-server');
  });

  describe('# should able to', () => {

    it('start / stop engine', () => {
      const engine = new Engine({ root: testRoot });
      engine.start();
      process.on('warning', e => console.warn(e.stack));
      engine.stop();
      engine.dispose(true);
    });

    it('add service to engine', () => {
      const engine = new Engine({ root: testRoot });
      engine.addService(EchoService, testRoot);
      engine.start();
      engine.stop();
      engine.dispose(true);
    })

  });

  describe('client', () => {

    let originalTimeout;
    let testRoot: string;
    let engine: Engine<IEngineSettings>;

    beforeAll(() => {
      originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;

      // resolve from process.cwd()
      testRoot = __dirname;
      engine = new Engine({ root: testRoot });
      engine.addService(EchoService, testRoot);
      engine.start();
    });

    afterAll(() => {
      engine.stop();
      engine.dispose(true);
      jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
    });

    it('echo', (done) => {

      let count = 10;
      const client = new EchoServiceClient(engine.port);
      client.metadata.add('displayName', 'Ling Zhang');

      const stream = client.echoStream('Ling');
      // console.log('set max to 12')
      // stream.setMaxListeners(12);

      stream.on('data', function (res: any) {

        console.log('stream', res);
        // call remote service with promise
        client.echo(`What? ${res.content}`).then(result => {
          console.log('echo', result);
          if (!--count) {
            done();
          }
        }).catch(err => {
          console.log('promise error', err);
        });
      });

      stream.on('end', function () {
        console.log('stream end');
      });

    });

  });

});
