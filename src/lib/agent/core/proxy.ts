import { Reflection } from './reflection';
import { InterceptorFactory } from './interceptor';
import { IActivatable } from './invocation';
import { IsUndefined, IsString } from './utils';
import { GetterInterceptor } from './interceptors/getter';
import { SetterInterceptor } from './interceptors/setter';
import { ConstructInterceptor } from './interceptors/construct';

export class ProxyInterceptor {
  
  /**
   * Construct a new object using Proxy
   * @param type
   * @param argumentsList
   * @returns {T}
   */
  public static construct<T>(type: IActivatable<T>, argumentsList: ArrayLike<any>): T {
    
    // Construct interceptor start
    const typeProxyHandler: ProxyHandler<IActivatable<T>> = {
      construct: ConstructInterceptor
    };
    const upgraded = new Proxy<IActivatable<T>>(type, typeProxyHandler);
    // Construct interceptor finish
    
    const proxy: ProxyHandler<T> = {
      get: GetterInterceptor,
      set: SetterInterceptor
    };
    
    const instance = Reflect.construct(upgraded, argumentsList);
    
    return new Proxy<T>(instance, proxy);
  }
  
}
