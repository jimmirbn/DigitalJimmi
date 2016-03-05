module.exports = function(grunt) {
    "use strict";
    require('time-grunt')(grunt);
    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        /**
         * Directory variables
         */
        app: {
            root: 'app/content/themes/<%= pkg.name %>',

            js: '<%= app.root %>/js',
            css: '<%= app.root %>',
            assets: '<%= app.root %>/assets'
        },
        src: {
            bower: 'bower_components',
            vendors: 'bower_components',
            root: 'src',
            js: '<%= src.root %>/js',
            sass: '<%= src.root %>/sass',
            temp: '<%= src.root %>/temp',
            html: '<%= src.root %>/templating',

            assets: '<%= src.root %>/assets'
        },


        /**
         * Annotate angular files before concatanation
         */
        ngAnnotate: {
            options: {
                singleQuotes: true
            },
            app: {
                files: {

                    '<%= src.temp %>/app.annotated.js': ['<%= src.js %>/angular/**/*.js'] // where 'app' is the name of the app
                }
            }
        },

        /**
         * concat setup remember to include ngAnnotated files
         */
        concat: {
            options: {
                sourceMap: true,
            },
            vendors: {
                src: [
                    '<%= src.bower %>/lodash/lodash.min.js',
                    '<%= src.bower %>/jquery/dist/jquery.js',
                    '<%= src.bower %>/matchMedia/matchMedia.js',
                    '<%= src.bower %>/fastclick/lib/fastclick.js',
                    '<%= src.bower %>/angular/angular.js',
                    '<%= src.bower %>/angular-sanitize/angular-sanitize.js',
                    '<%= src.bower %>/angular-animate/angular-animate.min.js',
                    '<%= src.bower %>/slick-carousel/slick/slick.min.js',
                    '<%= src.js %>/vendors/exif.js',
                    '<%= src.bower %>/object-fit/dist/polyfill.object-fit.js',
                    '<%= src.bower %>/binaryajax/binaryajax.js',

                    
                ],
                dest: '<%= app.js %>/vendors.js',
                nonull: true
            },
            app: {
                src: [
                    '<%= src.js %>/angular-open.js',
                    '<%= src.temp %>/app.annotated.js',
                    '<%= src.js %>/site.js',
                    '<%= src.js %>/angular-close.js'

                ],
                dest: '<%= app.js %>/site.js',
                nonull: true
            },
        },

        /**
         * uglify setup
         */
        uglify: {
            options: {
                mangle: false,
                sourceMap: true,
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            vendors: {
                files: {
                    '<%= app.js %>/vendors.min.js': '<%= app.js %>/vendors.js'
                }
            },
            site: {
                files: {
                    '<%= app.js %>/site.min.js': '<%= app.js %>/site.js'
                }
            },
            modernizr: {
                files: {
                    '<%= app.js %>/modernizr-custom.min.js': ['<%= app.js %>/modernizr-custom.js']
                }
            }
        },

        /**
         * SASS setup
         */
        sass: {
            dist: {
                options: {
                    loadPath: [
                        '',
                        ''
                    ],
                    banner: '/*\nTheme Name: <%= pkg.name %>\nTemplate: plant_boilerplate\nVersion: <%=pkg.version %>\nDescription: <%= pkg.description%>\nAuthor: <%= pkg.author %>\n*/',
                    style: 'expanded'
                },
                files: {
                    '<%= app.css %>/style.css': '<%= src.sass %>/style.scss'
                }
            },
        },
        cssmin: {
            target: {
                files: {
                    '<%= app.css %>/style.min.css': '<%= app.css %>/style.css'
                }
            }
        },
        /**
         * Add a custom modernizr based on what is actually used
         */
        modernizr: {
            dist: {
                "devFile": "<%= src.bower %>/modernizr/modernizr.js",
                "outputFile": "<%= app.js %>/modernizr-custom.js",
                "extra": {
                    "shiv": true,
                    "load": true,
                    "mq": true,
                    "cssclasses": true
                },
                "extensibility": {
                    "addtest": true,
                    "prefixed": false,
                    "teststyles": false,
                    "testprops": false,
                    "testallprops": false,
                    "hasevents": false,
                    "prefixes": false,
                    "domprefixes": false
                },
                "uglify": false,
                "parseFiles": true,
                "files": {
                    "src": ['<%= app.css %>/style.css', '<%= app.js %>/site.js', '<%= app.js %>/vendors.js']
                }
            }
        },

        /**
         * Copy wordpress theme files from src to theme
         */
        copy: {
            assets: {
                expand: true,
                cwd: '<%= src.assets %>/',
                src: ['**/*.{ico,xml}'],
                dest: '<%= app.img %>/'
            },

            themeTemplates: {
                expand: true,
                cwd: '<%= src.html %>',
                src: ['**', '**/*'],
                dest: '<%= app.root %>'
            }
        },

        /**
         * Remove temp files
         */
        clean: {
            temp: ['<%= src.temp %>']
        },

        /**
         * Minify image assets
         */
        imagemin: {
            assets: {
                files: [{
                    expand: true,
                    cwd: '<%= src.assets %>/',
                    src: ['**/*.{png,jpg,gif}'],
                    dest: '<%= app.assets %>/'
                }]
            },
            uploads: {
                files: [{
                    expand: true,
                    cwd: 'app/content/uploads/',
                    src: ['**/*.{png,jpg,gif}'],
                    dest: 'app/content/uploads/'
                }]
            }
        },

        /**
         * Minify svg assets
         */
        svgmin: {
            options: {
                plugins: [{
                    removeViewBox: false
                }, {
                    removeUselessStrokeAndFill: false
                }, {
                    convertPathData: {
                        straightCurves: false
                    }
                }]
            },
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= src.assets %>/',
                    src: ['**/*.svg'],
                    dest: '<%= app.assets %>/',
                    ext: '.svg'
                }]
            }
        },

        /**
         * Watch setup
         */
        watch: {
            jsfiles : {
                options : {
                    livereload : 35729
                },
                files: ['<%= src.js %>/**/*.js'],
                tasks: ['js_build']
            },
            sassfiles: {
                options : {
                    livereload : 35729
                },
                files: ['<%= src.sass %>/**/*.scss'],
                tasks: ['css_build']
            },
            assetsfiles: {
                options : {
                    livereload : 35729
                },
                files: ['<%= src.assets %>/**/*.{png,jpg,gif}', '<%= src.assets %>/*.{png,jpg,gif}', '<%= src.assets %>/**/*.svg', '<%= src.assets %>/*.svg'],
                tasks: ['assets_build']
            },
            templatefiles: {
                options : {
                    livereload : 35729
                },
                files: ['<%= src.html %>/**'],
                tasks: ['template_build']
            }
        },

        /**
         * Notify setup
         */
        notify_hooks: {
            options: {
                enabled: true,
                title: "<%= pkg.name %>" // defaults to the name in package.json, or will use project directory's name
            }
        },
        notify: {
            all: {
                options: {
                    message: 'APP build'
                }
            },
            css: {
                options: {
                    message: 'CSS build',
                }
            },
            js: {
                options: {
                    message: 'JS build',
                }
            },
            templates: {
                options: {
                    message: 'Templates build',
                }
            },
            assets: {
                options: {
                    message: 'Assets build',
                }
            }
        },
        concurrent: {
            concurrentOne: {
                tasks: ['copy', 'concat', 'sass'],
                options: {
                    logConcurrentOutput: true,
                    limit: 4
                }
            },
            concurrentTwo: {
                tasks: ['cssmin', 'uglify', 'svgmin'],
                options: {
                    logConcurrentOutput: true,
                    limit: 4
                }
            }
        }
    });
    /**
     * Task to install bower components listed in bower.json
     * @return {void}
     */
    grunt.registerTask('bower_install', 'install bower dependencies', function() {

        var exec = require('child_process').exec;
        var done = this.async();

        exec('bower install', { cwd: './' }, function(error, stdout, stderr) {
            grunt.log.writeln(stdout);
            if (error) {
                grunt.log.writeln('err');
                grunt.log.writeln(stderr);
            }
            done();
        });
    });

    grunt.registerTask('template_build', [
        'copy:themeTemplates',
        'notify:templates'
    ]);

    grunt.registerTask('css_build', [
        'sass',
        'modernizr',
        'cssmin',
        'notify:css'
    ]);

    grunt.registerTask('js_build', [
        'ngAnnotate',
        'concat:app',
        'modernizr',
        'uglify:site',
        'clean',
        'notify:js'
    ]);

    grunt.registerTask('assets_build', [
        'cssmin',
        'svgmin',
        'copy:assets',
        'notify:assets'
    ]);

    grunt.registerTask('imgminify', [
        'imagemin'
    ]);

    grunt.registerTask('once', [
        'ngAnnotate',
        'concurrent:concurrentOne',
        'concurrent:concurrentTwo',
        'modernizr',
        'clean',
        'notify:all'
    ]);

    grunt.registerTask('default', [
        'bower_install',
        'once',
        'watch'
    ]);

};
