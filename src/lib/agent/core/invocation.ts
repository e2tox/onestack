import { IInterceptor } from './interceptor';

export interface IInvocation {
  target: any;
  invoke(parameters: ArrayLike<any>): any;
}
