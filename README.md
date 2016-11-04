OneStack 3
==========

[![Build Status](https://travis-ci.org/e2tox/onestack.svg?branch=master)](https://travis-ci.org/e2tox/onestack)
[![Coverage Status](https://coveralls.io/repos/github/e2tox/onestack/badge.svg?branch=master)](https://coveralls.io/github/e2tox/onestack?branch=master)

### Example

1. Create new project using
```
npm init
```

2. Install onestack as a dependance
```
npm install onestack --save
```

3. Create `config.ts` file

```typescript
import { Kernel, IKernelSettings } from 'onestack';

interface IOAuthSettings extends IKernelSettings {
  GOOGLE_OAUTH_KEY: string
  GOOGLE_OAUTH_PASSWORD: string
}

export default new Kernel<IOAuthSettings>();
```

4. in your typescript file

```typescript
import app from './config'

app.init();

console.log(app.settings.GOOGLE_OAUTH_KEY)
```
