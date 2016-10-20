import { Kernel, IBasicSettings } from '../../src/lib'

interface IOAuthSettings extends IBasicSettings {
  GOOGLE_OAUTH_KEY: string
  GOOGLE_OAUTH_PASSWORD: string
}

export default new Kernel<IOAuthSettings>();
