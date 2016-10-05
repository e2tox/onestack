import { AgentProxy } from './proxy'
import { Reflection } from './core/reflection';
import { AgentAttribute } from './agent';

export interface IActivatable<T> {
  new(): T
}

export class Domain {
  
  /**
   * Create and register an agent to the domain
   * @param type
   * @param args
   * @returns {T}
   */
  public static createAgentFromType<T>(type: IActivatable<T>, ...args): T {
    
    let attrs = Reflection.getAttributes(type).filter(function(attr) {
      return attr.getType() === AgentAttribute.type
    });
    
    if (!attrs.length) {
      throw new TypeError('Agent Decoration Not Found')
    }
  
    if (attrs.length > 1) {
      throw new TypeError('Not Support Multiple Agent Decoration')
    }
    
    // for(const key in attrs) {
    //   const agentAttr = attrs[key] as AgentAttribute;
    //   console.log(`Create and register agent '${agentAttr.identifier}'`)
    // }
    
    const instance = Reflect.construct(type, args);
    return new Proxy<T>(instance, AgentProxy.getInstance<T>(type))
    
  }
  
}
