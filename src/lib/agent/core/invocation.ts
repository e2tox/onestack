export interface IActivatable<T> {
  new <T>(): T
}

export interface IInvocation {
  target: any;
  invoke(parameters: ArrayLike<any>): any;
}
