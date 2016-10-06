export interface IInvocation {
  target: any;
  invoke(parameters: ArrayLike<any>): any;
}
