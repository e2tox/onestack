import { Reflection } from '../reflection';
import { InterceptorFactory } from '../interceptor';

export function SetterInterceptor<T>(target: T, propertyKey: PropertyKey, value: any, receiver: any): boolean {
  
  // ignore private fields/method which start with '_'
  // if (propertyKey[0] === '_') {
  //   // console.log('proxy ignore private: ', propertyKey);
  //   return Reflect.set(target, propertyKey, value, receiver);
  // }
  
  const customAttributes = Reflection.getAttributes(target, propertyKey);
  
  // ignore non-agent methods
  if (!customAttributes.length) {
    console.log('no attr found', propertyKey)
    return Reflect.set(target, propertyKey, value, receiver);
  }
  
  // createGetterInterceptor invocation of interceptor chain
  const invocation = InterceptorFactory.createSetterInterceptor(customAttributes, target, propertyKey, receiver);
  
  // console.log('called set', propertyKey, value);
  // call the interceptors
  return invocation.invoke([value]);
  
}
