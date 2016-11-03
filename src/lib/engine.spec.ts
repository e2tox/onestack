import { Engine } from './engine';
import * as path from 'path';
import { EchoService } from '../../test/minimal-server/services/echo.service';
import { Logger } from './utils/logger';
import { IEngineSettings } from './engineSettings';

describe('server', () => {

  let testRoot: string;

  beforeAll(() => {
    // resolve from process.cwd()
    testRoot = path.resolve('test/minimal-server');
  });

  describe('# should able to', () => {

    let engine: Engine<IEngineSettings>;

    beforeEach(() => {
      engine = new Engine({ root: testRoot });
    });

    afterEach(() => {
      engine.dispose(true);
      engine = null;
    });

    it('start / stop', () => {
      engine.start();
      engine.stop();
    });

    it('start / stop with callback', next => {
      engine.start();
      engine.stop();
      engine.stop(next);
    });

    it('start / forceStop', () => {
      engine.start();
      engine.forceStop();
    });

    it('add service', () => {
      engine.addService(EchoService);
    });

    it('add service with custom proto path', () => {
      engine.addService(EchoService, testRoot);
    });

    it('check service', () => {
      engine.addService(EchoService);
      expect(engine.hasService('onestack.test.services.EchoService')).toBe(true);
    });

  });

  describe('# should not able to', () => {

    const echoServiceNs = 'onestack.test.services';
    let engine: Engine<IEngineSettings>;

    beforeEach(() => {
      engine = new Engine({ root: testRoot });
    });

    afterEach(() => {
      engine.dispose(true);
      engine = null;
    });

    it('add wrong service', () => {
      expect(() => {
        engine.addService(Logger, testRoot);
      }).toThrowError('Logger is not a service');
    });

    it('add same service', () => {
      engine.addService(EchoService, testRoot);
      expect(() => {
        engine.addService(EchoService, testRoot);
      }).toThrowError(`Duplicate service identifier: ${echoServiceNs}.EchoService`);
    });

    it('add service without proto file', () => {
      expect(() => {
        engine.addService(EchoService, '/');
      }).toThrowError(`Protocol file '${echoServiceNs}.proto' not found at: /protos/${echoServiceNs}.proto`);
    });

  });

});
