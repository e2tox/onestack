import { IKernelSettings } from './kernelSettings';

export interface IServerSettings extends IKernelSettings {
  HOST: string
  PORT: number
}
