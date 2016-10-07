import { Reflection } from './reflection';
import { InterceptorFactory } from './interceptor';
import { IActivatable } from './invocation';
import { IsUndefined } from './utils';
import { GetterInterceptor } from './interceptors/getter';
import { SetterInterceptor } from './interceptors/setter';

export class ProxyInterceptor {
  
  public static construct<T>(target: IActivatable<T>, argumentsList: ArrayLike<any>): T {
    
    // Construct interceptor start
    const customAttributes = Reflection.getAttributes(target);
    const constructor = InterceptorFactory.createConstructInterceptor(customAttributes, target, target);
    const instance = constructor.invoke(argumentsList);
    // Construct interceptor finish
    
    const proxy: ProxyHandler<T> = {
      get: GetterInterceptor,
      set: SetterInterceptor
    };
    
    return new Proxy<T>(instance, proxy)
  
    // const classProxyHandler: ProxyHandler<IActivatable<T>> = {
    //   construct: ConstructInterceptor
    // };
    // return new Proxy<IActivatable<T>>(type, classProxyHandler);
  }
  
  public static registerClass<T>(type: IActivatable<T>): boolean {
    
    // get the prototype of function
    const members = Object.getOwnPropertyNames(type.prototype);

    // replace the prototype method if found attributes
    for (const id in members) {
      
      const propertyKey = members[id];
  
      // ignore private fields
      if (propertyKey[0] === '_') {
        continue;
      }
      
      const descriptor = Object.getOwnPropertyDescriptor(type.prototype, propertyKey);
      const attributes = Reflection.getOwnAttributes(type.prototype, propertyKey);

      if (!attributes.length) {
        continue;
      }
  
      if (!IsUndefined(descriptor.value)) {
        const chain = InterceptorFactory.createPrototypeInterceptor(attributes);
        descriptor.value = chain.entry(descriptor.value);
      }
      else {
        if (!IsUndefined(descriptor.get)) {
          const chain = InterceptorFactory.createPrototypeInterceptor(attributes);
          descriptor.get = chain.entry(descriptor.get);
        }
        if (!IsUndefined(descriptor.set)) {
          const chain = InterceptorFactory.createPrototypeInterceptor(attributes);
          descriptor.set = chain.entry(descriptor.set);
        }
      }
      
      Object.defineProperty(type.prototype, propertyKey, descriptor);

    }
    
    return true;
  }
}
