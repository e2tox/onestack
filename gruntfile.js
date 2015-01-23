'use strict';

module.exports = function (grunt) {

    // Unified Watch Object
    var watchFiles = {
        serverJS: ['lib/*.js', 'index.js'],
        serverTests: ['test/*/*_spec.js'],
        ignores: ['node_modules/**', '.git/**', '.idea/', '.cache/', '.tmp/']
    };

    var allFiles = watchFiles.serverTests
        .concat(watchFiles.serverJS);

    // Project Configuration
    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        /*
         * JSLint
         * ===========================================
         */
        // region JSLint, jscs, jsbeautifier, nodemon, watch, node-inspector, concurrent definition
        jshint: {
            options: {
                reporter: require('jshint-stylish')
            },
            all: {
                src: allFiles,
                options: {
                    jshintrc: true
                }
            },
            test: {
                src: watchFiles.serverTests,
                options: {
                    jshintrc: true
                }
            }
        },
        jsbeautifier: {
            options: {
                js: {
                    braceStyle: 'collapse',
                    breakChainedMethods: false,
                    e4x: false,
                    evalCode: false,
                    indentChar: ' ',
                    indentLevel: 0,
                    indentSize: 4,
                    indentWithTabs: false,
                    jslintHappy: true,
                    keepArrayIndentation: false,
                    keepFunctionIndentation: false,
                    maxPreserveNewlines: 10,
                    preserveNewlines: true,
                    spaceBeforeConditional: true,
                    spaceInParen: false,
                    unescapeStrings: false,
                    wrapLineLength: 0
                }
            },
            all: {
                src: allFiles
            }
        },
        jscs: {
            options: {
                config: '.jscsrc'
            },
            all: {
                src: allFiles
            }
        },
        watch: {
            test: {
                files: allFiles,
                tasks: ['newer:jshint:test', 'env:test', 'mochacov:test']
            }
        },
        // endregion

        /**
         * Tests
         */
        mochacov: {
            options: {
                coverage: true,
                require: ['should'],
                reporter: 'html-cov',
                output: 'test/coverage.html',
                files: watchFiles.serverTests
            },
            test: {
                options: {
                    coverage: false,
                    output: false,
                    reporter:'nyan'
                }
            },
            spec: {
                options: {
                    coverage: false,
                    output: false,
                    reporter: 'spec'
                }
            },
            teamcity: {
                options: {
                    coverage: false,
                    output: false,
                    reporter: 'mocha-teamcity-reporter'
                }
            },
            cov: watchFiles.serverTests
        }
    });

    // Load grunt tasks automatically
    require('load-grunt-tasks')(grunt);

    // Making grunt default to force in order not to break the project.
    grunt.option('force', true);

    // Default task(s).
    grunt.registerTask('default', ['env:test', 'watch:test']);

    // Lint task(s).
    grunt.registerTask('lint', ['jshint', 'jscs', 'jsbeautifier']);

    // We don't need setup a test server here because we use injection to the server instance directly
    grunt.registerTask('coverage', ['mochacov:spec', 'mochacov:cov']);
    grunt.registerTask('teamcity', ['mochacov:teamcity', 'mochacov:cov']);


};
