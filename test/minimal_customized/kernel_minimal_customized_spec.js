'use strict';

/**
 * Test Module dependencies.
 */

// Init the configuration module
var kernel = require('../../index');
var should = require('should');

describe('Init with minimal customized settings', function () {
    it('should contains PORT number', function (done) {
        (function () {
            delete kernel.logger;
            delete kernel.errorLogger;
            delete kernel.settings;
            kernel.init(__dirname);
            kernel.settings.should.have.property('PORT', 11022);
            done();
        }).should.not.throw();
    });
});
