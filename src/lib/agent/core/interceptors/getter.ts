import { Reflection } from '../reflection';
import { InterceptorFactory } from '../interceptor';
import { IsUndefined } from '../utils';

export function GetterInterceptor<T>(target: T, propertyKey: PropertyKey, receiver: any): any {
  
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
  
  // createGetterInterceptor invocation of interceptor chain
  const invocation = InterceptorFactory.createGetterInterceptor(customAttributes, target, propertyKey, receiver);
  
  if (IsUndefined(reflection.descriptor)) {
    return invocation.invoke([]);
  }
  else {
    if (!IsUndefined(reflection.descriptor.get)) {
      return invocation.invoke([]);
    }
    else if (!IsUndefined(reflection.descriptor.value)) {
      return function () {
        return invocation.invoke(arguments);
      };
    }
  }
  
  throw new TypeError('Unknown InterceptorFactory type');
  
}
