import { IInvocation } from './invocation';
import { IAttribute } from './attribute';
import { IsFunction } from './utils';

export interface IInterceptor {
  intercept(invocation: IInvocation, parameters: ArrayLike<any>): any;
}

export class Interceptor {
  
  public static create(attributes: Array<IAttribute>,
                       target: any,
                       propertyKey: PropertyKey,
                       receiver: any) {
    
    const chain = new InvocationChain(target, propertyKey, receiver);
    
    // make invocation chain of interceptors
    attributes.forEach(function (attribute) {
      chain.use(attribute.getInterceptor());
    });
    
    return chain.entry();
  }
}

class InvocationChain {
  
  private _invocation: IInvocation;
  
  constructor(target: any, propertyKey: PropertyKey, receiver: any) {
    this._invocation = new OriginInvocation(target, propertyKey, receiver);
  }
  
  use(interceptor: IInterceptor): void {
    this._invocation = new InceptionInvocation(this._invocation, interceptor);
  }
  
  entry(): IInvocation {
    return this._invocation;
  }
  
}

class OriginInvocation implements IInvocation {
  
  constructor(private _target: any, private _propertyKey: PropertyKey, private _receiver: any) {
  }
  
  get target(): any {
    return this._target;
  }
  
  invoke(parameters: ArrayLike<any>): any {
    const result = Reflect.get(this._target, this._propertyKey);
    if (IsFunction(result)) {
      // the function call inside this function will be intercepted
      return Reflect.apply(result, this._receiver, parameters);
    }
    else {
      return result;
    }
  }
  
}

class InceptionInvocation implements IInvocation {
  
  constructor(private _invocation: IInvocation, private _interceptor: IInterceptor) {
  }
  
  get target(): any {
    return this._invocation.target;
  }
  
  invoke(parameters: ArrayLike<any>): any {
    return this._interceptor.intercept(this._invocation, parameters);
  }
  
}
