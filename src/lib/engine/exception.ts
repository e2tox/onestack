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

  private processEvents: any;
  private engineEvents: any;

  constructor(private _engine: Engine<IEngineSettings>) {

    this.processEvents = {
      'uncaughtException': this.handleUncaughtException(this),
      'SIGINT': this.gracefullyShutdown(this),
      'SIGTERM': this.gracefullyShutdown(this),
      'exit': this.exit(this)
    };

    this.engineEvents = {
      'fatal': this.handleFatalException(this),
      'error': this.handleError(this),
      'warning': this.handleWarning(this)
    };

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
    this.processEvents = null;
    this.engineEvents = null;
    this._engine = null;

    this['_id'] = Date.now();

    // display all registered event handlers
    // const events2 = process.eventNames().map(name=>({ [name]: process.listenerCount(name) }));
    // console.log('process events after', events2);
  }

  private handleUncaughtException(handler) {
    return function (err) {
      // provide friendly message
      if (err.code === 'EACCES') {
        const fatal = new Fatal('Please run with sudo', err);
        handler._engine.emit('fatal', fatal);
      }
      else if (err.code === 'EADDRINUSE') {
        const fatal = new Fatal(`Engine cannot be started. Port '${handler._engine.port}' is occupied`, err);
        handler._engine.emit('fatal', fatal);
      }
      else {
        console.error('catch err', err);
        handler._engine.emit('error', err);
      }
    }
  }

  private handleFatalException(handler) {
    return function (err: Fatal) {
      handler._engine.logger.fatal(err);
      handler.gracefullyShutdown();
    }
  }

  private handleError(handler) {
    return function (err: Error) {
      handler._engine.logger.error(err);
    }
  }

  private handleWarning(handler) {
    return function (warning: Error) {
      handler._engine.logger.warn(warning)
    }
  }

  private gracefullyShutdown(handler) {
    return function () {
      handler._engine.stop(() => {
        const exit = setTimeout(() => {
          console.log('INFO: Engine was shut down gracefully');
          process.exit(0);
        }, 10000);
        exit.unref();
      });
      handler._engine.dispose(false);
    }
  }

  private exit(handler) {
    return function () {
      console.log('WARN: Engine is going to exit');
      handler._engine.forceStop();
    }
  }

}
