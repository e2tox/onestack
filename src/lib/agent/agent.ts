import { Attribute } from './core/attribute';
import { IInterceptor } from './core/interceptor';
import { IInvocation } from './core/invocation';

/**
 * Define an agent
 * @param identifier
 * @returns {(target:any, propertyKey:string, descriptor:PropertyDescriptor)=>undefined}
 */
export function agent(identifier: string) {
  let attr = Reflect.construct(AgentAttribute, [identifier]) as Attribute;
  return attr.generateClassDecorator();
}

/**
 * AgentAttribute
 */
export class AgentAttribute extends Attribute implements IInterceptor {
  
  static type: string = 'agent.framework.agent';
  
  constructor(private _identifier: string) {
    super()
  }
  
  get identifier(): string {
    return this._identifier
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
