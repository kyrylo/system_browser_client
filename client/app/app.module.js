(function(global, angular) {
  'use strict';

  var applicationModules = [
    'app.gem',
    'app.behaviour'
  ];

  var vendorModules = [
    'underscore',
    'ngRoute',
    'ui.layout'
  ];

  var appModules = applicationModules.concat(vendorModules);

  global.app = angular.module('systemBrowser', appModules);
})(window.global, window.angular);
