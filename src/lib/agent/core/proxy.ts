import { Reflection } from './reflection';
import { Interceptor } from './interceptor';
import { IsUndefined } from './utils';
import { IActivatable } from './invocation';

export class ProxyInterceptor<T> implements ProxyHandler<T> {
  
  public static create<T>(target: IActivatable<T>, argumentsList: ArrayLike<any>): T {
    const instance = Reflect.construct(target, argumentsList);
    return new Proxy<T>(instance, new ProxyInterceptor<T>())
  }

  get(target: T, propertyKey: PropertyKey, receiver: any): any {
    
    // ignore private fields/method which start with '_'
    if (propertyKey[0] === '_') {
      // console.log('proxy ignore private: ', prop);
      return Reflect.get(target, propertyKey);
    }
  
    // ignore array index
    if (typeof propertyKey === 'number') {
      // console.log('proxy ignore number: ', prop);
      return Reflect.get(target, propertyKey);
    }
  
    const reflection = Reflection.getInstance(target, propertyKey);
    const customAttributes = reflection.getAttributes();
    
    // ignore non-agent methods
    if (!customAttributes.length) {
      return Reflect.get(target, propertyKey);
    }
  
    // create invocation of interceptor chain
    const invocation = Interceptor.create(customAttributes, target, propertyKey, receiver);
  
    if (IsUndefined(reflection.descriptor)) {
      return invocation.invoke([]);
    }
    else {
      if (!IsUndefined(reflection.descriptor.get)) {
        return invocation.invoke([]);
      }
      else if (!IsUndefined(reflection.descriptor.value)) {
        return (...args): any => {
          return invocation.invoke(args);
        };
      }
    }
    
    throw new TypeError('Unknown Interceptor type');
  }

  set(target: T, propertyKey: PropertyKey, value: any, receiver: any): boolean {
    
    // ignore private fields/method which start with '_'
    if (propertyKey[0] === '_') {
      // console.log('proxy ignore private: ', prop);
      return Reflect.set(target, propertyKey, value, receiver);
    }
    
    // TODO: run interceptor before set the value
    console.log('called set', propertyKey, value);
    return Reflect.set(target, propertyKey, value, receiver);
  }
  
}
