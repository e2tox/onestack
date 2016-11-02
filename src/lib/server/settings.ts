import { IBasicSettings } from '../settings';

export interface IServerSettings extends IBasicSettings {
  HOST: string
  PORT: number
}
