import { Directory } from './utils/directory'
import { agent, success, prerequisite } from './agent.state';
import { loadSettings } from './loader';

/**
 * naming an agent using @gent
 */
@agent('OneStack')
export class Kernel {
  
  private _root: Directory;
  private _settings: any;
  
  public static getInstance(): Kernel {
    return new Kernel();
  }
  
  @prerequisite('initialized', false, 'OneStack already initialized')
  @success('initialized', true)
  public init(configDir: string = process.cwd()): void {
    this._root = Directory.withReadPermission(configDir);
    this._settings = loadSettings(this._root);
  }
  
  @prerequisite('initialized', true, 'OneStack not initialized. Please call init() first!')
  public get root(): Directory {
    // console.log('read root', this._root, arguments);
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
    if (this._settings.hasOwnProperty(key)) {
      throw new Error('Missing required configuration setting: `' + key + '`');
    }
    return this._settings[key];
  }
  
  @prerequisite('initialized', true, 'OneStack not initialized. Please call init() first!')
  public has(key: string): boolean {
    return this._settings.hasOwnProperty(key);
  }
  
}

