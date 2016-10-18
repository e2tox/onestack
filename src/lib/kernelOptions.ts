import { IsUndefined } from './utils/utils';

export interface IKernelOptions {
  root?: string;
  autoCreateDir?: boolean;
}

export class KernelOptions implements IKernelOptions {

  root: string;
  autoCreateDir: boolean;

  constructor(opts: IKernelOptions) {
    if (IsUndefined(opts)) {
      this.root = process.cwd();
      this.autoCreateDir = true;
    }
    else {
      this.root = opts.root || process.cwd();
      this.autoCreateDir = IsUndefined(opts.autoCreateDir) ? true : !!opts.autoCreateDir;
    }
  }

}
