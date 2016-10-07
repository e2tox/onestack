import { Directory } from './utils/directory'
import { Domain, agent } from './agent'
import { success, prerequisite } from './agent.state';
import { output } from './agent.state/output';

/**
 * naming an agent using @gent
 */
@agent('OneStack')
export class Kernel {
  
  private _root: Directory;
  
  constructor() {
    // console.log('get root in cons', this._root);
  }
  
  public static getInstance(): Kernel {
    return Domain.createAgentFromType(Kernel);
  }
  
  @prerequisite('initialized', false, 'OneStack already initialized')
  @success('initialized', true)
  public init(configDir: string = process.cwd()): void {
    this._root = Directory.withReadPermission(configDir);
    // const conf = this._root.resolve('conf');
    // console.log(conf);
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
  
}
