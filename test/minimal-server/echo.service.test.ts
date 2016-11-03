import { EchoServiceClient } from './sdk/echo.service.client';
import { Engine } from '../../src/lib/engine';
import { IEngineSettings } from '../../src/lib/engineSettings';
import { EchoService } from './services/echo.service';
import * as path from 'path';
import { Echo2Service } from './services/echo2.service';
import { Echo3Service } from './services/echo3.service';

describe('echo service', () => {

  let testRoot: string;

  beforeAll(() => {
    // resolve from process.cwd()
    testRoot = path.resolve('test/minimal-server');
  });

  describe('engine', () => {

    let engine: Engine<IEngineSettings>;
    const echoServiceNs = 'onestack.test.services';

    beforeEach(() => {
      engine = new Engine({ root: testRoot });
    });

    afterEach(() => {
      engine.dispose(true);
      engine = null;
    });

    it('add non-exists service', () => {
      expect(() => {
        engine.addService(Echo2Service, testRoot);
      }).toThrowError(`Service '${echoServiceNs}.Echo2Service' not found in protocol file: ` +
      `'${testRoot}/protos/${echoServiceNs}.proto'`);
    });

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

    it('server error', (done) => {
      engine.addService(Echo3Service, testRoot);
      engine.start();
      const client = new EchoServiceClient(engine.port);
      const response = client.echoStream('get error');

      expect(response).toBeDefined();

      console.log('client-side stream');

      response.on('metadata', (metadata) => {
        console.log('client metadata', metadata)
      });

      response.on('data', (data) => {
        console.log('client data', data);
      });

      response.on('error', (err) => {
        console.log('client error', err);
        done();
      });

      response.on('end', () => {
        console.log('client end');
        done();
      })

    });

    it('client error', (done) => {
      engine.addService(EchoService, testRoot);
      engine.start();

      const client = new EchoServiceClient(engine.port);
      client.echoError('Error').then(result => {
        expect(result).toBeUndefined();
        done();
      }).catch(err => {
        expect(err).toBeDefined();
        expect(err.message).toEqual('not allowed');
        done();
      });
    });

    it('echo stream', (done) => {

      engine.addService(EchoService, testRoot);
      engine.start();

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
