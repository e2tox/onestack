'use strict';

/**
 * Module dependencies.
 */

var path = require('path');
var fs = require('fs');



/**
 * Module init function.
 */

module.exports = function (root) {

    // Check NODE_ENV
    if (!process.env.NODE_ENV) {
        console.error('\x1b[33m', 'NODE_ENV is not defined! Using default production environment', '\x1b[0m');
        process.env.NODE_ENV = 'production';
    }

    /**
     * Before we begin, lets set the environment variable
     * We'll Look for a valid NODE_ENV variable and if one cannot be found load the development NODE_ENV
     */
    var configFile = path.join(root, 'conf/' + process.env.NODE_ENV + '.yaml');

    console.log();
    if (fs.existsSync(configFile)) {
        console.log('\x1b[7m', 'Application loaded using the "' + process.env.NODE_ENV + '" environment configuration', '\x1b[0m');
    } else {
        console.error('\x1b[31m', 'No configuration file found for "' + process.env.NODE_ENV + '", using environment variables instead', '\x1b[0m');
    }
    console.log();

    // Add require support to: yaml
    require('require-yaml');
};
