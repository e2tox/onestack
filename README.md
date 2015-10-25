OneStack Enterprise Service Platform
====================================

[![Build Status](https://img.shields.io/travis/e2tox/onestack.svg?style=flat)](https://travis-ci.org/e2tox/OneStack)
[![Coverage Status](https://img.shields.io/coveralls/e2tox/OneStack/master.svg?style=flat)](https://coveralls.io/r/e2tox/OneStack?branch=master)

### Long Term Support Schedule

- 2.x (10/1/2015 - 10/1/2018)
- v.Next (10/1/2017 - 10/1/2020)

### Projects

#### OneStack 

YAML based configuration management and Winston based logging system - ALL IN PLACE!!! 

```
npm install onestack
```

URL: [https://github.com/e2tox/onestack](https://github.com/e2tox/onestack)


#### OneStack Service Platform


HAPI backed API server which comes with awesome swagger UI.
```
npm install onestack-service
```

URL: [https://github.com/e2tox/onestack-service](https://github.com/e2tox/onestack-service)

### Create Your Project

Clone this [starter project](https://github.com/e2tox/onestack-service-project) and you will able to build your next API backend within few clicks!!!

#### 1. Configuration:  YAML

conf/settings.yaml

``` YAML
---
# application info
ID: ONE
TITLE: OneStack Enterprise Service Platform

# PaaS will always set the PORT environment variable
PORT: 11020

# Explorer will display the tagged services under this url
EXPLORE_SERVICE_BASE: /api/v1

# relative path to HOME_DIR
LOG_DIR: ./logs

```

#### 2. API Route:
server/routes/engine.server.route.js

``` javascript
module.exports = function (server) {
    server.route({
        method: 'POST',
        path: '/api/v1/engine',
        handler: function (request, reply) {
            reply('hi, there');
        },
        config: {
            description: 'Start engine',
            tags: ['Business Process Engine']
        }
    });
};
```

#### 3. Run Your API Backend

``` javascript
var app         = require('onestack');
var Server      = require('onestack-service');

var instance    = new Server(app);

instance.init(__dirname);
instance.start();
```

#### 4. Useful console output for logging and analysis
![Console Output](https://raw.githubusercontent.com/e2tox/images/master/onestack.png)

#### 5. Explorer Your API
http://localhost:11020/explorer

![API Explorer](https://raw.githubusercontent.com/e2tox/images/master/onestack-service.png)

#### Extra: Check and Read Settings

``` javascript
var app = require('onestack');

if (app.has('PORT')) {
    console.log(app.get('PORT'));
}
```

#### Extra: Write Log

``` javascript
var app = require('onestack');

app.debug('this is info');
app.verbose('this is info');
app.info('this is info');
app.warn('this is info');
app.error('this is info');
```
