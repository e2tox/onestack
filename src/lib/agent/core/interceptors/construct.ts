import { Reflection } from '../reflection';
import { InterceptorFactory } from '../interceptor';
import { IsUndefined } from '../utils';
import { IActivatable } from '../invocation';



export function ConstructInterceptor<T>(target: IActivatable<T>, argArray: ArrayLike<any>, receiver: any): any {
  
  const customAttributes = Reflection.getAttributes(target);
  
  // this is proxy intercetpor
  // console.log('this', this);
  // console.log('target.prototype', target.prototype);
  // console.log('receiver.prototype', receiver.prototype);
  
  const invocation = InterceptorFactory.createConstructInterceptor(customAttributes, target, receiver);
  
  // return the new class constructor
  return invocation.invoke(argArray);
  
}
