import { IInterceptor } from './interceptor';

export interface IInvocation {
  target: any;
  invoke(parameters: ArrayLike<any>): any;
}

export class InvocationWrapper implements IInvocation {
  
  private constructor(private _invocation: IInvocation, private _interceptor: IInterceptor) {
  }
  
  public static create(invocation: IInvocation, interceptor: IInterceptor): IInvocation {
    return new InvocationWrapper(invocation, interceptor);
  }
  
  get target(): any {
    return this._invocation.target;
  }
  
  public invoke(parameters: ArrayLike<any>): any {
    return this._interceptor.intercept(this._invocation, parameters);
  }
  
}
