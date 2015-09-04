'use strict';


/**
 * Module dependencies.
 */
var path = require('path');
var fs = require('fs');
var winston = require('winston');


/**
 * Configure the kernel from application root folder
 * @param {string} root
 * @param {Object} kernel
 */
module.exports.configure = function (root, kernel) {

    // current working directory by default
    root = root || process.cwd();

    /**
     * Init and check app settings
     */
    require('./init')(root);

    /**
     * Load app settings
     */
    kernel.settings = require('./loader')(root);
    kernel.transports = winston.transports;

    /**
     * Run bootstrap script
     */
    var bootstrapScript = path.join(root, 'conf/' + process.env.NODE_ENV + '.js');
    if (fs.existsSync(bootstrapScript)) {
        require(bootstrapScript)(kernel, kernel.settings);
    }

    var embeddedLogger = require('./logger');

    /**
     * Create logger
     */
    var logger = new(winston.Logger)(kernel.logger || embeddedLogger.createDefaultLogger());

    kernel.log = function () {
        logger.log.apply(logger, arguments);
    };

    kernel.info = function () {
        logger.info.apply(logger, arguments);
    };

    kernel.debug = function () {
        logger.debug.apply(logger, arguments);
    };

    kernel.silly = function () {
        logger.silly.apply(logger, arguments);
    };


    /**
     * Create error logger
     */
    var errorLogger = new(winston.Logger)(kernel.errorLogger || embeddedLogger.createErrorLogger());

    kernel.error = function () {
        errorLogger.error.apply(errorLogger, arguments);
    };
    kernel.warn = function () {
        errorLogger.warn.apply(errorLogger, arguments);
    };

    /**
     * Display the settings
     */
    logger.info('Active server properties:');
    for (var key in kernel.settings) {
        if (kernel.settings.hasOwnProperty(key)) {
            if (key.indexOf('_KEY',  key.length - 4) !== -1 ||
                key.indexOf('_PASSWORD',  key.length - 9) !== -1 ) {
                var value = kernel.settings[key];
                var masked = '';
                for(var idx=0; idx<value.length; idx++) {
                    if ( idx < 2 || idx > value.length - 3) {
                        masked += value[idx];
                    }
                    else {
                        masked += '*';
                    }
                }
                logger.info('\t' + key + ' = ', masked);
            }
            else {

                logger.info('\t' + key + ' =', kernel.settings[key]);
            }
        }
    }


};
