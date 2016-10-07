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
  
  /**
   * Upgrade instance to agent
   * @param instance
   * @returns {T}
   */
  public static upgradeInstance<T>(instance: T): T {
    const proxy: ProxyHandler<T> = {
      get: GetterInterceptor,
      set: SetterInterceptor
    };
    return new Proxy<T>(instance, proxy);
  }
  
  /**
   * Upgrade class to agent
   * @param type
   * @returns {any}
   */
  public static upgradeClass<T>(type: IActivatable<T>): IActivatable<T> {
    
    const typeProxyHandler: ProxyHandler<IActivatable<T>> = {
      construct: ConstructInterceptor
    };
    const upgraded = new Proxy<IActivatable<T>>(type, typeProxyHandler);
    
    // get the prototype of function
    const keys = Reflect.ownKeys(type.prototype);

    const propertyDescriptors = keys
      .filter(key => key[0] !== '_')
      .filter(key => IsString(key))
      .filter(key => Reflection.hasAttributes(type.prototype, key))
      .map(key => {
  
        console.log('working at ', key);
        const descriptor = Object.getOwnPropertyDescriptor(type.prototype, key);
        const attributes = Reflection.getAttributes(type.prototype, key);
        
        if (!IsUndefined(descriptor.value)) {
          descriptor.value = InterceptorFactory.createFunctionInterceptor(attributes, descriptor.value);
        }
        if (!IsUndefined(descriptor.get)) {
          descriptor.get = InterceptorFactory.createFunctionInterceptor(attributes, descriptor.get);
        }
        if (!IsUndefined(descriptor.set)) {
          descriptor.set = InterceptorFactory.createFunctionInterceptor(attributes, descriptor.set);
        }
        
        return {key, descriptor};
        
      }).reduce((map, item) => {
        map[item.key] = item.descriptor;
        return map;
      }, {});
    
    Object.defineProperties(upgraded.prototype, propertyDescriptors);
    
    return upgraded;
  }
  
}
