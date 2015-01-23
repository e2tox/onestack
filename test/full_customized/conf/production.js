'use strict';

var winston = require('winston'),
path = require('path');


module.exports = function (kernel, settings) {

    //require('winston-sendmail');

    kernel.logger = {
        transports: [
            new winston.transports.Console({
                level: 'info',
                colorize: true
            }),
            new(winston.transports.DailyRotateFile)({
                level: 'info', // silly, debug, verbose, info, warn, error
                filename: path.join(settings.LOG_DIR, 'access-'),
                datePattern: 'yyyy-MM-dd.log',
                maxsize: 5242880 /* 5MB */
            })
        ]
    };

    kernel.errorLogger = {
        transports: [
            new winston.transports.Console({
                level: 'error',
                colorize: true
            }),
            new(winston.transports.DailyRotateFile)({
                level: 'error',
                filename: path.join(settings.LOG_DIR, 'error-'),
                datePattern: 'yyyy-MM-dd.log',
                maxsize: 5242880 /* 5MB */
            })
        ]
    };

    //if (settings.MAILER) {
    //config.errorLogger.transports.push(
    //    new(winston.transports.Mail)({
    //        level: 'info',
    //        from: 'Microbox.io ' + settings.VERSION + '<noreply-website-logger@microbox.io>',
    //        to: 'log@microbox.io',
    //        transport: 'SMTP',
    //        options: {
    //            service: settings.MAILER_SERVICE,
    //            auth: {
    //                user: settings.MAILER_USER,
    //                pass: settings.MAILER_PASS
    //            }
    //        }
    //    })
    //);
    //}

};
