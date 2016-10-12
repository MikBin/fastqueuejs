module.exports = function(grunt) {
    const babel = require('rollup-plugin-babel');
    // Project configuration.

    grunt.initConfig({
        distFolder: 'dist',
        pkg: grunt.file.readJSON('package.json'),
        // JS build configuration
        copy: {
            options: {
                // Custom function to remove all export and import statements
                process: function(src) {
                    return src.replace(/^(export|import).*/gm, '');
                }
            },
            main: {
                expand: true,
                cwd: 'src/js/',
                src: '*.js',
                dest: 'distes6/',
                flatten: true,
                filter: 'isFile'
            }
        },
        rollup: {
            main: {
                options: {
                    sourceMap: true,
                    format: 'umd',
                    moduleName: 'FastQueueJs',
                    plugins: function() {
                        return [
                            babel({
                                exclude: './node_modules/**',
                                presets: ['es2015-rollup'],
                            }),
                        ];
                    },
                },
                dest: 'dist/fastqueuejs.js',
                src: 'src/js/main.js', // Only one source file is permitted as others are taken from dependencies
            },
            keepes6: {
                options: {
                    sourceMap: true,
                    format: 'umd',
                    moduleName: 'FastQueueJs'
                },
                dest: 'distes6/fastqueuejs.js',
                src: 'src/js/main.js', // Only one source file is permitted as others are taken from dependencies
            },
        },
        babel: {
            dev: {
                options: {

                    sourceMap: true,
                    modules: 'umd'
                },
                files: {
                    'dist/fastqueuejs.js': 'src/js/main.js'
                }
            }
        },
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
                screwIE8: true
            },
            build: {
                src: '<%= distFolder %>/fastqueuejs.js',
                dest: '<%= distFolder %>/<%= pkg.name %>.min.js'
            }
        }
    });

    // Load the plugin that provides the "uglify" task.
    /*if production strip out testing code */
    grunt.loadNpmTasks('grunt-rollup');
    grunt.loadNpmTasks('grunt-contrib-copy');
    //grunt.loadNpmTasks('grunt-babel');

    // Default task(s).
    grunt.registerTask('default', ['copy', 'rollup', 'rollup:keepes6']);

};