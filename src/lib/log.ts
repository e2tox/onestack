export enum LogLevel {
  /**
   * Logging from external libraries used by your app or very detailed application logging.
   * @type {number}
   */
  Trace = 10,

  /**
   * Anything else, i.e. too verbose to be included in "info" level.
   * @type {number}
   */
  Debug = 20,

  /**
   * Detail on regular operation.
   * @type {number}
   */
  Info = 30,

  /**
   * A note on something that should probably be looked at by an operator eventually.
   * @type {number}
   */
  Warn = 40,

  /**
   * Fatal for a particular request, but the service/app continues servicing other requests. An operator should look
   * at this soon(ish).
   * @type {number}
   */
  Error = 50,

  /**
   * The service/app is going to stop or become unusable now. An operator should definitely look into this soon.
   * @type {number}
   */
  Fatal = 60
}

export interface ILogger {

  child(options: LoggerOptions, simple?: boolean): ILogger;
  child(obj: Object, simple?: boolean): ILogger;

  reopenFileStreams(): void;

  level(): string | number;
  level(value: number | string): void;
  levels(name: number | string, value: number | string): void;

  trace(error: Error, format?: any, ...params: any[]): void;
  trace(buffer: Buffer, format?: any, ...params: any[]): void;
  trace(obj: Object, format?: any, ...params: any[]): void;
  trace(format: string, ...params: any[]): void;
  debug(error: Error, format?: any, ...params: any[]): void;
  debug(buffer: Buffer, format?: any, ...params: any[]): void;
  debug(obj: Object, format?: any, ...params: any[]): void;
  debug(format: string, ...params: any[]): void;
  info(error: Error, format?: any, ...params: any[]): void;
  info(buffer: Buffer, format?: any, ...params: any[]): void;
  info(obj: Object, format?: any, ...params: any[]): void;
  info(format: string, ...params: any[]): void;
  warn(error: Error, format?: any, ...params: any[]): void;
  warn(buffer: Buffer, format?: any, ...params: any[]): void;
  warn(obj: Object, format?: any, ...params: any[]): void;
  warn(format: string, ...params: any[]): void;
  error(error: Error, format?: any, ...params: any[]): void;
  error(buffer: Buffer, format?: any, ...params: any[]): void;
  error(obj: Object, format?: any, ...params: any[]): void;
  error(format: string, ...params: any[]): void;
  fatal(error: Error, format?: any, ...params: any[]): void;
  fatal(buffer: Buffer, format?: any, ...params: any[]): void;
  fatal(obj: Object, format?: any, ...params: any[]): void;
  fatal(format: string, ...params: any[]): void;
}

export interface LoggerOptions {
  name: string;
  streams?: Stream[];
  level?: string | number;
  stream?: NodeJS.WritableStream;
  serializers?: Serializers;
  src?: boolean;
}

export interface Serializers {
  [key: string]: (input: any) => string;
}

export interface Stream {
  type?: string;
  level?: number | string;
  path?: string;
  stream?: NodeJS.WritableStream | Stream;
  closeOnExit?: boolean;
  period?: string;
  count?: number;
}
