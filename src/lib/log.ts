export enum LogLevel {
  Silly = 1,
  Debug,
  Verbose,
  Info,
  Warn,
  Error
}

export interface ILog {
  app: string
  transaction: string
  code: string
  level: LogLevel
  message: string
  timestamp: Date
  context?: any
}

export class Log implements ILog {

  protected constructor(private _app: string,
                        private _transaction: string,
                        private _code: string,
                        private _level: LogLevel,
                        private _message: string,
                        private _timestamp: Date,
                        private _context: any | null) {
  }

  public get app(): string {
    return this._app;
  }

  public get transaction(): string {
    return this._transaction;
  }

  public get code(): string {
    return this._code;
  }

  public get level(): LogLevel {
    return this._level;
  }

  public get message(): string {
    return this._message;
  }

  public get timestamp(): Date {
    return this._timestamp;
  }

  public get context(): any | null {
    return this._context;
  }

}
