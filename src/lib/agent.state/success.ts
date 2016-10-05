import { Attribute, IInterceptor, IInvocation } from '../agent';

/**
 * Define a prerequisite
 * @param key
 * @param value
 * @returns {(target:any, propertyKey:string, descriptor:PropertyDescriptor)=>undefined}
 */
export function success(key: string, value: any) {
  const attribute = new SuccessAttribute(key, value);
  return attribute.generateClassMemberDecorator();
}

/**
 * PrerequisiteAttribute
 */
class SuccessAttribute extends Attribute implements IInterceptor {
  
  static type: string = 'agent.framework.success';
  
  constructor(private _key: string, private _value: any) {
    super()
  }

  get key(): string {
    return this._key
  }
  
  get value(): boolean {
    return this._value
  }
  
  getType(): string {
    return SuccessAttribute.type
  }
  
  getInterceptor(): IInterceptor {
    return this;
  }
  
  intercept(invocation: IInvocation, parameters: ArrayLike<any>): any {
    const result = invocation.invoke(parameters);
    // debug(`SuccessAttribute updating target value ${this.key}='${this.value}'`);
    Reflect.set(invocation.target, this.key, this.value);
    return result;
  }
}
