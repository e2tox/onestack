'use strict';

/**
 * Test Module dependencies.
 */

// Init the configuration module
var kernel = require('../index');
var should = require('should');

describe('Init without settings.yml', function () {
    it('should throw error without settings.yml', function () {
        (function () {
            kernel.init(__dirname + '/missing_settings_yaml');
        }).should.throw();
    });
});
