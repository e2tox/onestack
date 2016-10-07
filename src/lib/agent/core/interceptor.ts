import {
  IInvocation, GetterInvocation, IActivatable, ConstructInvocation, SetterInvocation, IInvoke
} from './invocation';
import { IAttribute } from './attribute';
import { createInvocationChainFromAttribute } from './chain';

export interface IInterceptor {
  intercept(invocation: IInvocation, parameters: ArrayLike<any>): any;
}

export class InterceptorFactory {
  
  public static createConstructInterceptor<T>(attributes: Array<IAttribute>,
                                              target: IActivatable<T>,
                                              receiver: any): IInvocation {
    
    const invocation = new ConstructInvocation(target, receiver);
    return createInvocationChainFromAttribute(invocation, attributes);
  }
  
  public static createGetterInterceptor(attributes: Array<IAttribute>,
                                        target: any,
                                        propertyKey: PropertyKey,
                                        receiver: any): IInvocation {
    const invocation = new GetterInvocation(target, propertyKey, receiver);
    return createInvocationChainFromAttribute(invocation, attributes);
  }
  
  public static createSetterInterceptor(attributes: Array<IAttribute>,
                                        target: any,
                                        propertyKey: PropertyKey,
                                        receiver: any) {
    const invocation = new SetterInvocation(target, propertyKey, receiver);
    return createInvocationChainFromAttribute(invocation, attributes);
  }
  
  public static createFunctionInterceptor(attributes: Array<IAttribute>, method: IInvoke) {
  
    const origin: IInvocation = {
      invoke: function(parameters: ArrayLike<any>) {
        return Reflect.apply(method, this.target, parameters);
      }
    };
  
    const chain = createInvocationChainFromAttribute(origin, attributes);
  
    return function () {
      origin.target = this;
      origin.method = method;
      return chain.invoke(arguments);
    };
    
  }
  
}
