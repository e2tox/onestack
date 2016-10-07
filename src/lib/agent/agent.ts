import { decorateClass, IAttribute, IInterceptor, IInvocation } from './core';
import { IActivatable } from './core/invocation';

/**
 * Define an agent
 * @param identifier
 * @returns {(target:any, propertyKey:string, descriptor:PropertyDescriptor)=>undefined}
 */
export function agent(identifier: string) {
  return decorateClass(new AgentAttribute(identifier));
}

/**
 * AgentAttribute
 */
export class AgentAttribute implements IAttribute, IInterceptor {
  
  static type: string = 'agent.framework.agent';
  
  constructor(private _identifier: string) {
  }
  
  get identifier(): string {
    return this._identifier
  }
  
  beforeDecorate(target: Object|Function, targetKey?: string|symbol, descriptor?: PropertyDescriptor): boolean {
    return true;
  }
  
  getType(): string {
    return AgentAttribute.type
  }
  
  getInterceptor(): IInterceptor {
    return this;
  }
  
  intercept(invocation: IInvocation, parameters: ArrayLike<any>): any {
    return invocation.invoke(parameters);
  }
  
}


export class Agent<T> {
  
  constructor(type: IActivatable<T>, ...args) {
    
  }
  
}
