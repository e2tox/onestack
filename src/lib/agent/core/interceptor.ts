import {
  IInvocation, GetterInvocation, IActivatable, ConstructInvocation, SetterInvocation,
  FunctionInvocation
} from './invocation';
import { IAttribute } from './attribute';
import { InvocationChainFactory, PrototypeInvocationChain } from './chain';

export interface IInterceptor {
  intercept(invocation: IInvocation, parameters: ArrayLike<any>): any;
}

export class InterceptorFactory {
  
  /**
   * Create interceptor for constructor
   * @param attributes
   * @param target
   * @param receiver
   * @returns {IInvocation}
   */
  public static createConstructInterceptor<T>(attributes: Array<IAttribute>,
                                              target: IActivatable<T>,
                                              receiver: any): IInvocation {
    
    const invocation = new ConstructInvocation(target, receiver);
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
  
  
  public static createFunctionInterceptor(attributes: Array<IAttribute>, target: Function) {
    const invocation = new FunctionInvocation(target);
    return InvocationChainFactory.createInvocationChain(invocation, attributes);
  }
  
  public static createPrototypeInterceptor(attributes: Array<IAttribute>): PrototypeInvocationChain {
    return InvocationChainFactory.createPrototypeInvocationChain(attributes);
  }
  
}


