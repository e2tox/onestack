export interface IKernelOptions {
  root?: string;
  confDir?: string;
}

export class KernelOptions {

  static parse(opts: IKernelOptions): IKernelOptions {
    const defaultOpts = {
      root: process.cwd(),
      confDir: 'conf'
    };
    return Object.assign(defaultOpts, opts);
  }

}
