import { Engine } from '../../src/lib/engine';
import { IEngineSettings } from '../../src/lib/engineSettings';
import { EchoService } from './services/echo.service';
import * as path from 'path';
import { Echo2ServiceClient } from './sdk/echo2.service.client';

describe('echo2 service', () => {

  let testRoot: string;

  beforeAll(() => {
    // resolve from process.cwd()
    testRoot = path.resolve('test/minimal-server');
  });

  describe('client with pre-defined parameters', () => {

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

    it('echo server stream', (done) => {

      engine.addService(EchoService, testRoot);
      engine.start();

      let count = 10;
      const client = new Echo2ServiceClient(engine.port);
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
