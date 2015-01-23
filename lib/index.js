'use strict';


/**
 * Module dependencies.
 */
var path = require('path');
var fs = require('fs');
var _ = require('lodash');
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

    kernel.log = function (message, context) {
        logger.log('verbose', message, context);
    };

    kernel.info = function () {
        logger.info.apply(logger.info, arguments);
    };

    kernel.debug = function () {
        logger.debug.apply(logger.debug, arguments);
    };

    kernel.silly = function () {
        logger.silly.apply(logger.silly, arguments);
    };


    /**
     * Create error logger
     */
    var errorLogger = new(winston.Logger)(kernel.errorLogger || embeddedLogger.createErrorLogger());

    kernel.error = function () {
        errorLogger.error.apply(logger.error, arguments);
    };
    kernel.warn = function () {
        errorLogger.warn.apply(logger.warn, arguments);
    };

    /**
     * Display the settings
     */
    logger.info('Server properties:');
    for (var key in kernel.settings) {
        if (kernel.settings.hasOwnProperty(key)) {
            logger.info(key + ' =', kernel.settings[key]);
        }
    }

};
