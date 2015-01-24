'use strict';

module.exports = function (grunt) {

    // Unified Watch Object
    var watchFiles = {
        serverJS: ['lib/*.js', 'index.js'],
        serverTests: ['test/*_spec.js'],
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
        // region JSLint, jscs, jsbeautifier, nodemon, watch definition
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
                tasks: ['newer:jshint:test', 'mocha_istanbul:test']
            }
        },
        // endregion

        mocha_istanbul: {
            test: {
                src: ['test'], // a folder works nicely
                options: {
                    reporter: 'spec',
                    coverage: false
                    //root: './lib'
                }
            },
            coverage: {
                src: ['test'], // a folder works nicely
                options: {
                    reporter: 'mocha-teamcity-reporter',
                    coverage: false,
                    check: {
                        lines: 80,
                        statements: 80,
                        branches: 80,
                        functions: 80
                    },
                    //root: './lib', // define where the cover task should consider the root of libraries that are covered by tests
                    reportFormats: ['teamcity', 'html', 'lcovonly']
                }
            }
        }

    });

    // Load grunt tasks automatically
    require('load-grunt-tasks')(grunt);

    // Making grunt default to force in order not to break the project.
    grunt.option('force', true);

    grunt.event.on('coverage', function(lcov, done){
        require('coveralls').handleInput(lcov, function(err){
            if (err) {
                return done(err);
            }
            done();
        });
    });

    // Default task(s).
    grunt.registerTask('default', ['env:test', 'watch:test']);

    // Lint task(s).
    grunt.registerTask('lint', ['jshint', 'jscs', 'jsbeautifier']);

    // We don't need setup a test server here because we use injection to the server instance directly
    grunt.registerTask('coverage', ['mocha_istanbul:coverage']);

};
