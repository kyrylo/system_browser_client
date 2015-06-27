'use strict';

module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),

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
          'assets/js/main.js'
        ],

        dest: 'dist/<%= pkg.name %>.js'
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', ['concat', 'watch']);
};
