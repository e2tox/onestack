import { Kernel } from './kernel';
import { IServerSettings } from './serverSettings';
export { IServerSettings } from './serverSettings';
import { prerequisite, agent } from 'agentframework';
import { IKernelOptions } from './kernelOptions';

/**
 * Make strong typed settings
 */
@agent('OneStack.Server')
export class Server<T extends IServerSettings> extends Kernel<T> {

  constructor() {
    super();
  }

  ////////////// Domain ////////////////
  @prerequisite('initialized', false, 'OneStack already initialized')
  start(opts?: IKernelOptions): void {
    this.init(opts);
    console.log(this.settings);
  }

}
