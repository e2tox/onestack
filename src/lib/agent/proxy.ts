import { Reflection } from './core/reflection';
import { IActivatable } from './domain';
import { Interceptor } from './interceptor';

export class AgentProxy<T> implements ProxyHandler<T> {
  
  public static getInstance<T>(type: IActivatable<T>): AgentProxy<T> {
    return new AgentProxy<T>();
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
    const customAttributes = reflection ? reflection.getAttributes() : [];
    
    // ignore non-agent methods
    if (!customAttributes.length) {
      return Reflect.get(target, propertyKey);
    }
    
    return Interceptor.createProxyInterceptor(target, propertyKey, receiver, customAttributes, reflection);
    
  }

  set(target: T, p: PropertyKey, value: any, receiver: any): boolean {
    // TODO: run interceptor before set the value
    return Reflect.set(target, p, value, receiver);
  }
  
}
