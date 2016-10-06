import { IsFunction } from './utils';
export interface IActivatable<T> {
  new (): T
}

export interface IInvocation {
  target: any;
  invoke(parameters: ArrayLike<any>): any;
}


export class GetterInvocation implements IInvocation {
  
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

export class SetterInvocation implements IInvocation {
  
  constructor(private _target: any, private _propertyKey: PropertyKey, private _receiver: any) {
  }
  
  get target(): any {
    return this._target;
  }
  
  invoke(parameters: ArrayLike<any>): any {
    return Reflect.set(this._target, this._propertyKey, parameters[0], this._receiver);
  }
  
}


export class ConstructInvocation implements IInvocation {
  
  constructor(private _target: any) {
  }
  
  get target(): any {
    return this._target;
  }
  
  invoke(parameters: ArrayLike<any>): any {
    return Reflect.construct(this._target, parameters);
  }
  
}
