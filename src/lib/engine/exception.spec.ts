import { IEngineSettings } from '../engineSettings';
import { Engine } from '../engine';
import { Fatal } from './exception';
import * as path from 'path'

describe('exception', () => {

  let engine: Engine<IEngineSettings>;
  let testRoot: string;

  beforeEach(() => {
    // resolve from process.cwd()
    testRoot = path.resolve('test/minimal');
    engine = new Engine({ root: testRoot });
  });

  afterEach(() => {
    engine.dispose(true);
    engine = null;
  });

  it('ExtendableError', () => {
    const fatal = new Fatal('test', new TypeError('not allowed'));
    expect(fatal).toBeDefined();
  });

  it('engine warning', () => {
    engine.emit('warning', new Error('engine warning'));
    expect(engine).toBeDefined();
  });

  it('engine error', () => {
    engine.emit('error', new Error('engine error'));
    expect(engine).toBeDefined();
  });

  it('engine fatal', () => {
    engine.emit('fatal', new Error('engine fatal'));
    expect(engine).toBeDefined();
  });

  it('process uncaughtException 1', () => {
    const err = new Error('test process error 1');
    err['code'] = 'EACCES';
    engine.start();
    process.emit('uncaughtException', err);
    expect(engine).toBeDefined();
    engine.stop();
  });

  it('process uncaughtException 2', () => {
    const err = new Error('test process error 2');
    err['code'] = 'EADDRINUSE';
    engine.start();
    process.emit('uncaughtException', err);
    expect(engine).toBeDefined();
    engine.stop();
  });

  it('process uncaughtException 3', () => {
    const err = new Error('test process error 3');
    process.emit('uncaughtException', err);
    expect(engine).toBeDefined();
  });

  // it('process exit', () => {
  //   const err = new Error('test process exit');
  //   process.emit('exit', err);
  //   expect(engine).toBeDefined();
  // });

  // it('process SIGTERM', () => {
  //   const err = new Error('test process SIGTERM');
  //   process.emit('SIGTERM', err);
  //   expect(engine).toBeDefined();
  // });

});
