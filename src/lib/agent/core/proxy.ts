import { Reflection } from './reflection';
import { InterceptorFactory } from './interceptor';
import { IActivatable } from './invocation';
import { GetterInterceptor } from './interceptors/getter';
import { SetterInterceptor } from './interceptors/setter';

export class ProxyInterceptor {
  
  public static construct<T>(target: IActivatable<T>, argumentsList: ArrayLike<any>): T {
    
    // Construct interceptor start
    const customAttributes = Reflection.getAttributes(target);
    const constructor = InterceptorFactory.createConstructInterceptor(customAttributes, target);
    const instance = constructor.invoke(argumentsList);
    // Construct interceptor finish
    
    const proxy: ProxyHandler<T> = {
      get: GetterInterceptor,
      set: SetterInterceptor
    };
    
    return new Proxy<T>(instance, proxy)
  }
  
}
