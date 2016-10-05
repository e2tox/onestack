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
   * Get interceptor for this invocation
   */
  getInterceptor(): IInterceptor
  
}

/**
 * Attribute base class
 */
export class Attribute implements IAttribute {
  
  public beforeDecorate(target: Object|Function, targetKey?: string|symbol, descriptor?: PropertyDescriptor): boolean {
    // always allow decoration by default, unless this method been overwrite by inherited class
    return true
  }
  
  public getType(): string {
    throw new TypeError('Not Implemented')
  }
  
  public getInterceptor(): IInterceptor {
    throw new TypeError('Not Implemented')
  }
  
  generateClassDecorator() {
    return (target: Function): void => {
      if (this.beforeDecorate(target)) {
        const reflection = Reflection.getOwnInstance(target);
        reflection.addAttribute(this);
      }
    };
  }
  
  generateClassMemberDecorator() {
    return (target: Object, propertyKey: string | symbol, descriptor?: PropertyDescriptor): void => {
      if (this.beforeDecorate(target, propertyKey, descriptor)) {
        const reflection = Reflection.getOwnInstance(target, propertyKey, descriptor);
        reflection.addAttribute(this);
      }
    }
  }
  
}
