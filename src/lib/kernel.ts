import { Directory } from './utils/directory'
import { agent, success, prerequisite } from 'agentframework';
import { LoadSettings } from './loader';
import { IsUndefined } from './utils/utils';
import { IKernelOptions, KernelOptions } from './kernelOptions';

/**
 * naming an agent using @gent
 */
@agent('OneStack')
export class Kernel {

  private _root: Directory;
  private _settings: any;
  private _opts: IKernelOptions;

  public static getInstance(): Kernel {
    return new Kernel();
  }

  @prerequisite('initialized', false, 'OneStack already initialized')
  @success('initialized', true)
  public init(opts?: IKernelOptions): void {
    this._opts = new KernelOptions(opts);
    this._root = Directory.withReadPermission(this._opts.root);
    this._settings = LoadSettings(this._root, this._opts.confDir, this._opts.autoCreateDir);
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

}
