import { IInvocation } from './invocation';
import { IAttribute } from './attribute';
import { IInterceptor } from './interceptor';

export class InvocationChainFactory {
  
  public static createInvocationChain(origin: IInvocation, attributes: Array<IAttribute>) {
    
    const chain = new InvocationChain(origin);
    
    // make invocation chain of interceptors
    attributes.forEach(function (attribute) {
      chain.use(attribute.getInterceptor());
    });
    
    return chain.entry();
  }
}

/**
 * The chain builder
 */
class InvocationChain {
  
  constructor(private _invocation: IInvocation) {
  }
  
  use(interceptor: IInterceptor): void {
    this._invocation = new InceptionInvocation(this._invocation, interceptor);
  }
  
  entry(): IInvocation {
    return this._invocation;
  }
  
}

/**
 * InceptionInvocation will call next interceptor in the chain
 */
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
