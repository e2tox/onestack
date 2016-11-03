import { IsUndefined } from './utils/utils';

export interface IKernelOptions {
  root?: string;
  confDir?: string;
}

export class KernelOptions implements IKernelOptions {

  root: string;
  confDir: string;

  constructor(opts: IKernelOptions) {
    this.root = process.cwd();
    this.confDir = 'conf';

    if (!IsUndefined(opts)) {
      this.root = opts.root || this.root;
      this.confDir = opts.confDir || this.confDir;
    }
  }

  static parse(opts: IKernelOptions): IKernelOptions {
    return new KernelOptions(opts);
  }

}
