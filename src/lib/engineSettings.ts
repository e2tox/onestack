import { IKernelSettings } from './kernelSettings';

export interface IEngineSettings extends IKernelSettings {
  HOST: string
  PORT: number
}
