import { ProxyInterceptor } from './core/proxy'
import { Reflection } from './core/reflection';
import { AgentAttribute } from './agent';
import { IActivatable } from './core/invocation';

export class Domain {
  
  /**
   * Create and register an agent to the domain
   * @param type
   * @param args
   * @returns {T}
   */
  public static createAgentFromType<T>(type: IActivatable<T>, ...args): T {
    
    let attributes = Reflection.getAttributes(type).filter(attribute => attribute instanceof AgentAttribute);
    
    if (!attributes.length) {
      throw new TypeError('Agent Decoration Not Found')
    }
  
    if (attributes.length > 1) {
      throw new TypeError('Not Support Multiple Agent Decoration')
    }
    
    // for(const key in attrs) {
    //   const agentAttr = attrs[key] as AgentAttribute;
    //   console.log(`Create and register agent '${agentAttr.identifier}'`)
    // }
    
    return ProxyInterceptor.construct<T>(type, args);
    
  }
}
