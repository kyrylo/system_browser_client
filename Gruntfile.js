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
          'node_modules/angular/angular.js',
          'node_modules/angular-route/angular-route.js',
          'node_modules/angular-scroll/angular-scroll.js',

          'bower_components/raf/index.js',
          'bower_components/angular-ui-layout/ui-layout.js',

          'client/app/app.module.js',
          'client/app/app.routes.js',
          'client/app/app.config.js',

          'client/app/modules/vendor/**/*.module.js',

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

            'client/app/modules/**/assets/css/*',
            'client/app/assets/css/top.css',
            'client/app/assets/css/bottom.css',
            'client/app/assets/css/main.css'
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
              'client/app/views/*',
              'client/app/assets/**/*',
              'client/app/modules/**/assets/img/*',
              'client/index.html'
            ],
            dest: '<%= dist %>'
          },

          {
            expand: true,
            cwd: 'client/app',
            src: [
              'partials/*',
              'modules/**/partials/*'
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
