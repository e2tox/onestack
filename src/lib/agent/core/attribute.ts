import { IInterceptor } from './interceptor';
import { Reflection } from './reflection';

export interface IAttribute {
  
  /**
   * Fired before decoration of this attribute
   * @param target
   * @param targetKey
   */
  beforeDecorate(target: Object|Function, targetKey?: string|symbol, descriptor?: PropertyDescriptor): boolean
  
  /**
   * Get unique type name for this attribute
   */
  getType(): string
  
  /**
   * Get interceptor for this _invocation
   */
  getInterceptor(): IInterceptor
  
}

export function decorateClass(attribute: IAttribute) {
  return (target: Function): void => {
    if (attribute.beforeDecorate(target)) {
      Reflection.addAttribute(attribute, target);
    }
  }
}

export function decorateClassMembers(attribute: IAttribute) {
  return (target: Object, propertyKey: string | symbol, descriptor?: PropertyDescriptor): void => {
    if (attribute.beforeDecorate(target, propertyKey, descriptor)) {
      Reflection.addAttribute(attribute, target, propertyKey, descriptor)
    }
  }
}
