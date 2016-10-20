OneStack 3
==========

[![Build Status](https://travis-ci.org/e2tox/onestack.svg?branch=2.1-typescript)](https://travis-ci.org/e2tox/onestack)
[![Coverage Status](https://coveralls.io/repos/github/e2tox/onestack/badge.svg?branch=2.1-typescript)](https://coveralls.io/github/e2tox/onestack?branch=2.1-typescript)

### Commands

#### Start development workflow

```bash
npm start
```

#### Generate test coverage report

```bash
npm test
```

### Examples

create `config.ts` file

```typescript
import { Kernel } from 'onestack';
import { IBasicSettings } from 'onestack';

interface IOAuthSettings extends IBasicSettings {
  GOOGLE_OAUTH_KEY: string
  GOOGLE_OAUTH_PASSWORD: string
}

export default new Kernel<IOAuthSettings>();
```

in other typescript file

```typescript
import app from './config'

console.log(app.settings.GOOGLE_OAUTH_KEY)

```
