import { IAttribute, IInterceptor, IInvocation, decorateClassMembers } from '../agent/core';
import { debug } from '../logger';

/**
 * Print the property value
 * @param key
 * @returns {PropertyDecorator|MethodDecorator}
 */
export function output(key: string) {
  return decorateClassMembers(new OutputAttribute(key));
}

/**
 * OutputAttribute
 */
class OutputAttribute implements IAttribute, IInterceptor {
  
  static type: string = 'agent.framework.output';
  
  constructor(private _key: string) {
  }
  
  beforeDecorate(target: Object|Function, targetKey?: string|symbol, descriptor?: PropertyDescriptor): boolean {
    return true;
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
