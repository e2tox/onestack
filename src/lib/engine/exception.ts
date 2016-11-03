import { Engine } from '../engine';
import { IEngineSettings } from '../engineSettings';
import { IDisposable } from '../utils/disposable';

export class ExtendableError extends Error {
  cause: Error;
  constructor(message: string, cause?: Error) {
    super(message);
    this.name = this.constructor.name;
    this.cause = cause;
    this.message = message;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class Fatal extends ExtendableError {
}

export class ExceptionHandler implements IDisposable {

  private processEvents = {
    'uncaughtException': this.handleUncaughtException,
    'SIGINT': this.gracefullyShutdown,
    'SIGTERM': this.gracefullyShutdown,
    'exit': this.exit
  };

  private engineEvents = {
    'fatal': this.handleFatalException,
    'error': this.handleError,
    'warning': this.handleWarning
  };

  constructor(private _engine: Engine<IEngineSettings>) {
    // display all registered event handlers
    // const events1 = process.eventNames().map(name=>({ [name]: process.listenerCount(name) }));
    // console.log('process events before', events1);
    Object.keys(this.processEvents).forEach(key => {
      process.on(key, this.processEvents[key]);
    });
    Object.keys(this.engineEvents).forEach(key => {
      _engine.on(key, this.engineEvents[key]);
    });
  }

  public dispose(disposing: boolean): void {
    Object.keys(this.processEvents).forEach(key => {
      process.removeListener(key, this.processEvents[key]);
    });
    this._engine.removeAllListeners();
    this._engine = null;
    // display all registered event handlers
    // const events2 = process.eventNames().map(name=>({ [name]: process.listenerCount(name) }));
    // console.log('process events after', events2);
  }

  private handleUncaughtException(err) {
    // provide friendly message
    if (err.code === 'EACCES') {
      const fatal = new Fatal('Please run with sudo', err);
      this._engine.emit('fatal', fatal);
    }
    else if (err.code === 'EADDRINUSE') {
      const fatal = new Fatal(`Engine cannot be started. Port '${this._engine.port}' is occupied`, err);
      this._engine.emit('fatal', fatal);
    }
    else {
      this._engine.emit('error', err);
    }
  }

  private handleFatalException(err: Fatal) {
    this._engine.logger.fatal(err);
    this.gracefullyShutdown();
  }

  private handleError(err: Error) {
    this._engine.logger.error(err);
  }

  private handleWarning(warning: Error) {
    this._engine.logger.warn(warning)
  }

  private gracefullyShutdown() {
    this._engine.stop(() => {
      const exit = setTimeout(() => {
        console.log('INFO: Engine was shut down gracefully');
        process.exit(0);
      }, 10000);
      exit.unref();
    });
    this._engine.dispose(false);
  }

  private exit() {
    console.log('WARN: Engine is going to exit');
    this._engine.forceStop();
  }

}
