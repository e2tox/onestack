'use strict';

/**
 * Module dependencies.
 */

var fs = require('fs');
var path = require('path');
var _ = require('lodash');


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

    var settings = _.clone(require(settingsFile));
    var customSettingsFile = path.join(root, 'conf/' + process.env.NODE_ENV + '.yaml');
    if (fs.existsSync(customSettingsFile)) {
        var custom = _.clone(require(customSettingsFile));
        for (var k in custom) {
            if (custom.hasOwnProperty(k)) {

                if (custom[k] !== null) {
                    settings[k] = custom[k];
                }
            }
        }
    } else {
        console.log('Custom setting file `' + customSettingsFile + '` is not found');
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
    for (var key in settings) {
        if (settings.hasOwnProperty(key)) {
            if (typeof process.env[key] !== 'undefined') {
                console.log('Applying ' + key + ' from environment value `' + process.env[key] + '`');
                settings[key] = process.env[key];
            } else if (settings[key] === null) {
                fulfilled = false;
                console.log('Missing environment variable: ' + key);
            }
        }
    }

    if (!fulfilled) {
        throw Error('Prerequisite environment variable is missing');
    }

    /**
     * Convert all relative path to absolute path
     */
    var data_dir = settings.DATA_DIR;
    var log_dir = settings.LOG_DIR;

    settings.HOME_DIR = path.join(root, './');

    if (data_dir.length && data_dir[0] === '.') {
        settings.DATA_DIR = path.join(root, data_dir, './');
    } else {
        settings.DATA_DIR = path.join(data_dir, './');
    }

    if (log_dir.length && log_dir[0] === '.') {
        settings.LOG_DIR = path.join(root, log_dir, './');
    } else {
        settings.LOG_DIR = path.join(log_dir, './');
    }

    return settings;

};
