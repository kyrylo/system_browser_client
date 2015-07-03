'use strict';

module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),
    dist: 'dist/',

    watch: {
      files: [
        'client/**/*.js',
        'client/**/*.css',
        'client/**/*.html',
        'client/index.html',
        'Gruntfile.js'
      ],
      tasks: ['concat', 'cssmin', 'copy']
    },

    concat: {
      dist: {
        src: [
          'bower_components/jquery/dist/jquery.js',
          'node_modules/angular/angular.js',
          'node_modules/angular-route/angular-route.js',

          'bower_components/raf/index.js',
          'bower_components/angular-ui-layout/ui-layout.js',
          'bower_components/malihu-custom-scrollbar-plugin/jquery.mCustomScrollbar.concat.min.js',
          'bower_components/ng-scrollbars/dist/scrollbars.min.js',

          'client/app/app.module.js',
          'client/app/app.routes.js',
          'client/app/app.config.js',
          'client/app/**/*.js',
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
            'bower_components/malihu-custom-scrollbar-plugin/jquery.mCustomScrollbar.min.css',
            'client/app/css/main.css'
          ]
        }
      }
    },

    copy: {
      main: {
        files: [
          {
            expand: true,
            flatten: true,
            filter: 'isFile',
            src: [
              'client/app/fonts/*',
              'client/app/views/*',
              'client/app/img/*',
              'client/index.html'
            ],
            dest: '<%= dist %>'
          },

          {
            expand: true,
            cwd: 'client/app',
            src: [
              'partials/*',
            ],
            dest: '<%= dist %>'
          }
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
