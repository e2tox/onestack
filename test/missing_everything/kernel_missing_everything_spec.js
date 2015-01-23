'use strict';

/**
 * Test Module dependencies.
 */

// Init the configuration module
var kernel = require('../../index');
var should = require('should');

describe('Init without anything', function () {
    it('should throw error with default wd', function () {
        (function () {
            kernel.init();
        }).should.throw();
    });
    it('should throw error using current wd', function () {
        (function () {
            kernel.init(__dirname);
        }).should.throw();
    });
});
