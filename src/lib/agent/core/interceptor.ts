import { IInvocation, GetterInvocation } from './invocation';
import { IAttribute } from './attribute';
import { InvocationChainFactory } from './chain';

export interface IInterceptor {
  intercept(invocation: IInvocation, parameters: ArrayLike<any>): any;
}

export class InterceptorFactory {
  
  public static createGetterInterceptor(attributes: Array<IAttribute>,
                                        target: any,
                                        propertyKey: PropertyKey,
                                        receiver: any) {
  
    const invocation = new GetterInvocation(target, propertyKey, receiver);
    
    return InvocationChainFactory.createInvocationChain(invocation, attributes);
  }
}
