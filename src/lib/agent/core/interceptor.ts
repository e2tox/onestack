import { IInvocation, GetterInvocation, IActivatable, ConstructInvocation, SetterInvocation } from './invocation';
import { IAttribute } from './attribute';
import { InvocationChainFactory } from './chain';

export interface IInterceptor {
  intercept(invocation: IInvocation, parameters: ArrayLike<any>): any;
}

export class InterceptorFactory {
  
  /**
   * Create interceptor for constructor
   * @param attributes
   * @param target
   * @returns {IInvocation}
   */
  public static createConstructInterceptor<T>(attributes: Array<IAttribute>,
                                              target: IActivatable<T>): IInvocation {
    
    const invocation = new ConstructInvocation(target);
    
    return InvocationChainFactory.createInvocationChain(invocation, attributes);
  }
  
  /**
   * Create interceptor for getter
   * @param attributes
   * @param target
   * @param propertyKey
   * @param receiver
   * @returns {IInvocation}
   */
  public static createGetterInterceptor(attributes: Array<IAttribute>,
                                        target: any,
                                        propertyKey: PropertyKey,
                                        receiver: any): IInvocation {
    
    const invocation = new GetterInvocation(target, propertyKey, receiver);
    
    return InvocationChainFactory.createInvocationChain(invocation, attributes);
  }

  
  public static createSetterInterceptor(attributes: Array<IAttribute>,
                                        target: any,
                                        propertyKey: PropertyKey,
                                        receiver: any) {
    
    const invocation = new SetterInvocation(target, propertyKey, receiver);
  
    return InvocationChainFactory.createInvocationChain(invocation, attributes);
  }
}


