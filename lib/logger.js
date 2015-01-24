/**
 * Copyright 2014 Bestinet Sdn.Bhd.
 *
 * Created by ling on 1/23/15.
 */

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
