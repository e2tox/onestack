'use strict';

/**
 * Test Module dependencies.
 */

// Init the configuration module
var kernel = require('../index');
var should = require('should');


describe('Init with default settings', function () {
    it('should contains PORT number', function (done) {
        (function () {
            process.env.PORT = 11020;
            kernel.init(__dirname + '/only_default');
            // config from env: string
            // config from yml: integer
            kernel.settings.should.have.property('PORT', '11020');
            delete process.env.PORT;
            done();
        }).should.not.throw();
    });
});
