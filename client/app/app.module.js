(function(global, angular) {
  'use strict';

  var applicationModules = [
    'app.gem',
    'app.behaviour',
    'app.group',
    'app.method',
    'app.source'
  ];

  var vendorModules = [
    'underscore',
    'marked',
    'ngRoute',
    'ui.layout',
    'duScroll',
    'googlechart'
  ];

  var appModules = applicationModules.concat(vendorModules);

  global.app = angular.module('systemBrowser', appModules);
})(window.global, window.angular);
