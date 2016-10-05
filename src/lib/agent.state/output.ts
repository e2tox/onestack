import { IAttribute, Attribute, IInterceptor, IInvocation } from '../agent';
import { debug } from '../logger';

/**
 * Print the property value
 * @param key
 * @returns {PropertyDecorator|MethodDecorator}
 */
export function output(key: string): PropertyDecorator | MethodDecorator {
  const attr = new OutputAttribute(key);
  return attr.generateClassMemberDecorator();
}

/**
 * OutputAttribute
 */
class OutputAttribute extends Attribute implements IAttribute, IInterceptor {
  
  static type: string = 'agent.framework.output';
  
  constructor(private _key: string) {
    super();
  }

  getType(): string {
    return OutputAttribute.type
  }
  
  getInterceptor(): IInterceptor {
    return this;
  }
  
  intercept(invocation: IInvocation, parameters: ArrayLike<any>): any {
    const result = invocation.invoke(parameters);
    debug(`target.${this._key}='${Reflect.get(invocation.target, this._key)}'`);
    return result;
  }
  
}
