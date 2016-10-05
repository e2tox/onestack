import { IInvocation } from './invocation';

export interface IInterceptor {
  intercept(invocation: IInvocation, parameters: ArrayLike<any>): any;
}

export enum InterceptorType {
  FIELD = 1,
  METHOD
}
