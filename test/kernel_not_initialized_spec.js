'use strict';

/**
 * Test Module dependencies.
 */

// Init the configuration module

var should = require('should');
var file = require('path').join(__dirname, '../index.js');


describe('Kernel', function () {
    it('should throw error when call log()', function () {
        delete require.cache[file];
        var kernel = require('../index');
        (function () {
            kernel.log();
        }).should.throw();
    });
    it('should throw error when call info()', function () {
        (function () {
            delete require.cache[file];
            var kernel = require('../index');
            kernel.info();
        }).should.throw();
    });
    it('should throw error when call debug()', function () {
        (function () {
            delete require.cache[file];
            var kernel = require('../index');
            kernel.debug();
        }).should.throw();
    });
    it('should throw error when call silly()', function () {
        (function () {
            delete require.cache[file];
            var kernel = require('../index');
            kernel.silly();
        }).should.throw();
    });
    it('should throw error when call warn()', function () {
        (function () {
            delete require.cache[file];
            var kernel = require('../index');
            kernel.warn();
        }).should.throw();
    });
    it('should throw error when call error()', function () {
        (function () {
            delete require.cache[file];
            var kernel = require('../index');
            kernel.error();
        }).should.throw();
    });
});
