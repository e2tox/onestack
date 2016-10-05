import { IInvocation, InvocationWrapper } from './core/invocation';
import { IAttribute } from './core/attribute';
import { IInterceptor, InterceptorType } from './core/interceptor';
import { IsFunction, IsUndefined } from './utils';
import { Reflection } from './core/reflection';

export class Interceptor {

  public static createProxyInterceptor(target: any,
                                       propertyKey: PropertyKey,
                                       receiver: any,
                                       attributes: Array<IAttribute>,
                                       reflection: Reflection) {

    const interceptor = new ProxyInterceptor(target, propertyKey, receiver);

    if (IsUndefined(reflection.descriptor)) {
      interceptor.type = InterceptorType.FIELD;
    }
    else {
      if (!IsUndefined(reflection.descriptor.get)) {
        interceptor.type = InterceptorType.FIELD;
      }
      else if (!IsUndefined(reflection.descriptor.value)) {
        interceptor.type = InterceptorType.METHOD;
      }
    }

    // install each interceptor from attribute
    attributes.forEach(function (attribute) {
      interceptor.use(attribute.getInterceptor());
    });

    return interceptor.entry();
  }

}

class ProxyInterceptor {

  invocation: IInvocation;
  type: InterceptorType;

  constructor(target: any, propertyKey: PropertyKey, receiver: any) {
    this.invocation = new ProxyInterceptorInvocation(target, propertyKey, receiver);
  }

  public use(interceptor: IInterceptor): void {
    this.invocation = InvocationWrapper.create(this.invocation, interceptor);
  }

  public entry(): any {
    if (this.type === InterceptorType.METHOD) {
      return (...args): any => {
        return this.invocation.invoke(args);
      };
    }
    else if (this.type === InterceptorType.FIELD) {
      return this.invocation.invoke([]);
    }
    else {
      throw new TypeError('Not Supported Interceptor type');
    }
  }

}

class ProxyInterceptorInvocation implements IInvocation {

  constructor(private _target: any, private _propertyKey: PropertyKey, private _receiver: any) {

  }

  public get target(): any {
    return this._target;
  }

  public invoke(parameters: ArrayLike<any>): any {

    const propertyValueOrFunction = Reflect.get(this._target, this._propertyKey);

    if (IsFunction(propertyValueOrFunction)) {
      // the function call inside this function will be intercepted
      return Reflect.apply(propertyValueOrFunction, this._receiver, parameters);
    }
    else {
      return propertyValueOrFunction;
    }
  }

}
