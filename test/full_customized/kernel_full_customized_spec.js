'use strict';

/**
 * Test Module dependencies.
 */

// Init the configuration module
var kernel = require('../../index');
var should = require('should');

describe('Init with full customized settings', function () {
    it('should contains PORT number', function (done) {
        (function () {
            kernel.init(__dirname);
            kernel.settings.should.have.property('PORT', 11023);
            kernel.log('this is log');
            kernel.log('this is log');
            kernel.log('this is log');
            kernel.log('this is log');
            done();
        }).should.not.throw();
    });
    it('should able to write log', function () {
        kernel.init(__dirname);
        kernel.log('this is log');
        kernel.info('this is info');
        kernel.debug('this is debug');
        kernel.silly('this is silly');
    });
    it('should able to write error log', function () {
        kernel.init(__dirname);
        kernel.error('this is error');
        kernel.warn('this is warn');
    });
});

