'use strict';

module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),
    dist: 'dist/',

    watch: {
      files: [
        'assets/js/**/*.js',
        'Gruntfile.js'
      ],
      tasks: ['concat']
    },

    concat: {
      options: {
        banner: "'use strict';\n",
        process: function(src, filepath) {
          return '// Source: ' + filepath + '\n' +
            src.replace(/(^|\n)[ \t]*('use strict'|"use strict");?\s*/g, '$1');
        }
      },

      dist: {
        src: [
          'node_modules/angular/angular.js',
          'node_modules/angular-route/angular-route.js',
          'bower_components/raf/index.js',
          'bower_components/angular-ui-layout/ui-layout.js',
          'node_modules/underscore/underscore.js',
          'assets/js/main.js'
        ],

        dest: '<%= dist %><%= pkg.name %>.js'
      }
    },

    cssmin: {
      options: {
        shorthandCompacting: false,
        roundingPrecision: -1
      },

      target: {
        files: {
          '<%= dist %><%= pkg.name %>.css': [
            'node_modules/normalize.css/normalize.css',
            'bower_components/angular-ui-layout/ui-layout.css',
            'assets/css/main.css'
          ]
        }
      }
    },

    copy: {
      main: {
        files: [
          {expand: true,
           flatten: true,
           src: ['assets/fonts/*'],
           dest: '<%= dist %>',
           filter: 'isFile'},
        ]
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-copy');

  grunt.registerTask('default', ['concat', 'cssmin', 'copy', 'watch']);
};
