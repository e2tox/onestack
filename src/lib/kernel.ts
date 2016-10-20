import { EventEmitter } from 'events'
import { Directory } from './utils/directory'
import { agent, success, prerequisite } from 'agentframework'
import { Loader } from './loader'
import { IsUndefined } from './utils/utils'
import { IKernelOptions, KernelOptions } from './kernelOptions'
import { Logger } from './logger'
import { ILogger } from './log';
import { IBasicSettings } from './settings';

/**
 * naming an agent using @gent
 */
@agent('OneStack')
export class Kernel extends EventEmitter {

  private _root: Directory;
  private _settings: IBasicSettings;
  private _logger: ILogger;
  private _opts: IKernelOptions;

  constructor() {
    super()
  }

  public static getInstance(): Kernel {
    return new Kernel();
  }

  @prerequisite('initialized', false, 'OneStack already initialized')
  @success('initialized', true)
  public init(opts?: IKernelOptions): void {
    this._opts = new KernelOptions(opts);
    this._root = Directory.withReadPermission(this._opts.root);
    this._settings = Loader.LoadSettings(this._root, this._opts.confDir, this._opts.autoCreateDir);
    this._logger = Logger.createFromSettings(this._settings);
    this.emit('ready');
  }

  @prerequisite('initialized', true, 'OneStack not initialized. Please call init() first!')
  public get root(): Directory {
    return this._root;
  }

  @prerequisite('initialized', true, 'OneStack not initialized. Please call init() first!')
  public resolve(relativePath = ''): Directory {
    return this._root.resolve(relativePath);
  }

  @prerequisite('initialized', true, 'OneStack not initialized. Please call init() first!')
  public get settings(): any {
    return this._settings;
  }

  @prerequisite('initialized', true, 'OneStack not initialized. Please call init() first!')
  public get(key: string): boolean {
    if (IsUndefined(this._settings[key])) {
      throw new Error('Missing required configuration setting: `' + key + '`');
    }
    return this._settings[key];
  }

  @prerequisite('initialized', true, 'OneStack not initialized. Please call init() first!')
  public has(key: string): boolean {
    return !IsUndefined(this._settings[key]);
  }

  @prerequisite('initialized', true, 'OneStack not initialized. Please call init() first!')
  public get logger(): ILogger {
    return this._logger;
  }

}
