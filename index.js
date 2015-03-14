/**
 * OneStack Kernel Project
 *
 * Created by ling on 1/23/15.
 */

'use strict';

module.exports = {

    /**
     * Initialize application with configuration folder
     * @param {string} configPath
     */
    init: function (configPath) {
        return require('./lib').configure(configPath, this);
    },


    /**
     * Display welcome information for the server
     * @param {string} appName
     */
    welcome: function (appName) {
        this.info('\x1b[34m' + appName + ' ' + this.settings.VERSION + ' started on port ' + this.settings.PORT + '\x1b[0m');
    },


    /**
     * Settings placeholder
     */
    settings: {},

    /**
     * Placeholders
     */
    log: function() {
        throw Error('Please call init() first');
    },

    info: function() {
        throw Error('Please call init() first');
    },

    debug: function() {
        throw Error('Please call init() first');
    },

    silly: function() {
        throw Error('Please call init() first');
    },

    warn: function() {
        throw Error('Please call init() first');
    },

    error: function() {
        throw Error('Please call init() first');
    }

};
