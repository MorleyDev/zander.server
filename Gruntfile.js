module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        typescript: {
            base: {
                options: {
                    module: 'commonjs',
                    target: 'es5',
                    declaration: false,
                    comments: false,
                    noImplicitAny: true,
                    disallowAsi: true
                }
            },
            src: {
                src: ['src/**/*.ts'],
                dest: 'lib/server.js',
                options: {
                    basePath: 'src',
                    sourceMap: true
                }
            },
            unit: {
                src: ['unit/**/*.ts'],
                dest: 'lib/unit.js',
                options: {
                    basePath: 'unit',
                    sourceMap: true
                }
            }
        },
        uglify: {
            src: {
                options: {
                    banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
                    sourceMapIn: 'lib/server.js.map',
                    sourceMap: true
                },
                files: {
                    'lib/server.js': ['lib/server.js']
                }
            }
        },
        mochaTest: {
            options: {
                reporter: 'spec',
                timeout: 10000
            },
            spec: {
                src: ['spec/**/*.js']
            },
            unit: {
                src: ['lib/unit.js']
            },
            smoke: {
                src: ['smoke/**/*.js']
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-typescript');

    grunt.registerTask('default', ['typescript', 'uglify', 'mochaTest']);

    grunt.registerTask('prepublish', ['typescript:src', 'uglify:src']);
    grunt.registerTask('spec', ['typescript:src', 'mochaTest:spec']);
    grunt.registerTask('unit', ['typescript:unit', 'mochaTest:unit']);
    grunt.registerTask('smoke', ['mochaTest:smoke']);

};
