import { Kernel, IKernelSettings } from '../../src/lib'

interface IOAuthSettings extends IKernelSettings {
  GOOGLE_OAUTH_KEY: string
  GOOGLE_OAUTH_PASSWORD: string
}

export default new Kernel<IOAuthSettings>();
