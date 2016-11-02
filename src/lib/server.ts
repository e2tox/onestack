import { Kernel } from './kernel';
import { IServerSettings } from './server/settings';
import { prerequisite, agent } from 'agentframework';

/**
 * Make strong typed settings
 */
@agent('OneStack.Server')
export class Server<T extends IServerSettings> extends Kernel<T> {

  constructor() {
    super();
  }
  
  ////////////// Domain ////////////////
  @prerequisite('initialized', false, 'OneStack not initialized. Please call init() first!')
  start(): void {
    this.init();
    console.log(this.settings);
  }
  
}
