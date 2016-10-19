import { IsUndefined } from './utils/utils';

export interface IKernelOptions {
  root?: string;
  confDir?: string;
  autoCreateDir?: boolean;
}

export class KernelOptions implements IKernelOptions {

  root: string;
  confDir: string;
  autoCreateDir: boolean;

  constructor(opts: IKernelOptions) {
    this.root = process.cwd();
    this.confDir = 'conf';
    this.autoCreateDir = true;
    
    if (!IsUndefined(opts)) {
      this.root = opts.root || this.root;
      this.confDir = opts.confDir || this.confDir;
      this.autoCreateDir = IsUndefined(opts.autoCreateDir) ? this.autoCreateDir : !!opts.autoCreateDir;
    }
  }

}
