'use strict';

/**
 * Module dependencies.
 */

var fs = require('fs');
var path = require('path');
var utils = require('./utils');


/**
 * Module init function.
 */

module.exports = function (root) {

    /**
     * Load app configurations
     */
    var settingsFile = path.join(root, 'conf/settings.yaml');
    if (!fs.existsSync(settingsFile)) {
        console.log('Default setting file `' + settingsFile + '` is not found');
    }

    var settings = utils.clone(require(settingsFile));
    var customSettingsFile = path.join(root, 'conf/' + process.env.NODE_ENV + '.yaml');
    if (fs.existsSync(customSettingsFile)) {
        var custom = utils.clone(require(customSettingsFile));
        for (var k in custom) {
            if (custom.hasOwnProperty(k)) {

                if (custom[k] !== null) {
                    settings[k] = custom[k];
                }
            }
        }
    }

    /**
     * Load app version
     */
    var packageFile = path.join(root, 'package.json');
    if (fs.existsSync(packageFile)) {
        var pkg = require(packageFile);
        settings.VERSION = pkg.version;
    } else {
        console.log('Package setting file `' + packageFile + '` is not found');
    }

    /**
     * This is the last chance to get mandatory configurations from environment variables.
     */
    var fulfilled = true;
    var postfix = '_DIR';
    for (var key in settings) {
        if (settings.hasOwnProperty(key)) {
            if (typeof process.env[key] !== 'undefined') {
                console.log('Applying ' + key + ' from environment value `' + process.env[key] + '`');
                settings[key] = process.env[key];
            } else if (settings[key] === null) {
                fulfilled = false;
                console.log('Missing environment variable: ' + key);
            }

            /**
             * Convert all relative path to absolute path
             */
            if (key.indexOf(postfix, key.length - postfix.length) !== -1) {
                var dir = settings[key];
                if (dir.length && dir[0] === '.') {
                    settings[key] = path.join(root, dir, './');
                } else {
                    settings[key] = path.join(dir, './');
                }
            }
        }
    }

    if (!fulfilled) {
        throw Error('Prerequisite environment variable is missing');
    }

    // add Home dir
    settings.HOME_DIR = path.join(root, './');

    return settings;

};
