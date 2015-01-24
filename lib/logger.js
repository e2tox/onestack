'use strict';

var winston = require('winston');

module.exports = {

    createDefaultLogger: function () {
        return {
            transports: [
                new winston.transports.Console({
                    level: 'silly',
                    colorize: true
                })
            ]
        };
    },

    createErrorLogger: function () {
        return {
            transports: [
                new winston.transports.Console({
                    level: 'warn',
                    colorize: true
                })
            ]
        };
    }

};
