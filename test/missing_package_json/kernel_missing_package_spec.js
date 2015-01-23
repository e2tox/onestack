'use strict';

/**
 * Test Module dependencies.
 */

// Init the configuration module
var kernel = require('../../index');
var should = require('should');

describe('Init without package.json', function () {
    it('should now throw error but have an unknown version', function () {
        (function () {
            kernel.init(__dirname);
            kernel.settings.should.have.property('VERSION', 'latest');
        }).should.not.throw();
    });
});
