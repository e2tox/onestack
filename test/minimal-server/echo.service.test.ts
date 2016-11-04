import { EchoServiceClient } from './sdk/echo.service.client';
import { Engine } from '../../src/lib/engine';
import { IEngineSettings } from '../../src/lib/engineSettings';
import { EchoService } from './services/echo.service';
import * as path from 'path';
import { Echo2Service } from './services/echo2.service';
import { Echo3Service } from './services/echo3.service';
import { PassThrough } from 'stream';

describe('echo service', () => {
  
  let testRoot: string;
  
  beforeAll(() => {
    // resolve from process.cwd()
    testRoot = path.resolve('test/minimal-server');
  });
  
  // describe('engine', () => {
  //
  //   let engine: Engine<IEngineSettings>;
  //   const echoServiceNs = 'onestack.test.services';
  //
  //   beforeEach(() => {
  //     engine = new Engine({ root: testRoot });
  //   });
  //
  //   afterEach(() => {
  //     engine.dispose(true);
  //     engine = null;
  //   });
  //
  //   it('add non-exists service', () => {
  //     expect(() => {
  //       engine.addService(Echo2Service, testRoot);
  //     }).toThrowError(`Service '${echoServiceNs}.Echo2Service' not found in protocol file: ` +
  //       `'${testRoot}/protos/${echoServiceNs}.proto'`);
  //   });
  //
  // });
  
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
    
    // it('server promise error', (done) => {
    //   engine.addService(Echo3Service, testRoot);
    //   engine.start();
    //   const client = new EchoServiceClient(engine.port);
    //   client.echo('promise should error').then(result => {
    //     expect(result).toBeUndefined();
    //     done();
    //   }).catch(err => {
    //     expect(err).toBeDefined();
    //     expect(err.message).toEqual('Implementation must return a Promise');
    //     console.log(err.stack);
    //     done();
    //   });
    // });
    //
    // it('server stream error', (done) => {
    //   engine.addService(Echo3Service, testRoot);
    //   engine.start();
    //   const client = new EchoServiceClient(engine.port);
    //   const response = client.echoStream('get error');
    //
    //   expect(response).toBeDefined();
    //
    //   // optional
    //   response.on('metadata', (metadata) => {
    //     console.log('client metadata', metadata)
    //   });
    //   // optional
    //   response.on('error', (err) => {
    //     console.log('client error', err);
    //     done();
    //   });
    //   // must:  NOTE: this is the must-have event listener for stream response
    //   response.on('data', (data) => {
    //     console.log('client data', data);
    //   });
    //   // must
    //   response.on('end', () => {
    //     console.log('client end');
    //     done();
    //   })
    // });
    //
    // it('client error', (done) => {
    //   engine.addService(EchoService, testRoot);
    //   engine.start();
    //
    //   const client = new EchoServiceClient(engine.port);
    //   client.echoError('Error').then(result => {
    //     expect(result).toBeUndefined();
    //     done();
    //   }).catch(err => {
    //     expect(err).toBeDefined();
    //     expect(err.message).toEqual('not allowed');
    //     done();
    //   });
    // });
    //
    // it('echo server stream', (done) => {
    //
    //   engine.addService(EchoService, testRoot);
    //   engine.start();
    //
    //   let count = 10;
    //   const client = new EchoServiceClient(engine.port);
    //   client.metadata.add('displayName', 'Ling Zhang');
    //
    //   const stream = client.echoStream('Ling');
    //   // console.log('set max to 12')
    //   // stream.setMaxListeners(12);
    //
    //   stream.on('data', function (res: any) {
    //
    //     console.log('stream', res);
    //     // call remote service with promise
    //     client.echo(`What? ${res.content}`).then(result => {
    //       console.log('echo', result);
    //       if (!--count) {
    //         done();
    //       }
    //     }).catch(err => {
    //       console.log('promise error', err);
    //     });
    //   });
    //
    //   stream.on('end', function () {
    //     console.log('stream end');
    //   });
    //
    // });
    
    it('echo client stream', (done) => {
      
      engine.addService(EchoService, testRoot);
      engine.start();
      
      const client = new EchoServiceClient(engine.port);
      client.metadata.add('displayName', 'Ling Zhang');
      
      const transport = new PassThrough({ objectMode: true });
  
      for (let n1 = 1; n1 < 10; n1++) {
        transport.write({ content: `Pre cached Stream ${n1}` });
      }
      
      client.echoClientStream(transport).then((result)=> {
        console.log('client stream result', result);
        done();
      }).catch(err=> {
        console.log('client stream error', err);
        done();
      });
      
      for (let n2 = 10; n2 < 20; n2++) {
        transport.write({ content: `After Client Stream ${n2}` });
      }
      transport.end();
    });
  });
  
});
