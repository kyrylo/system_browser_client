(function(global) {
  'use strict';

  global.app.config(['$routeProvider', function($routeProvider) {
    $routeProvider
      .when('/', {
        controller: 'MainController',
        templateUrl: 'main.html'
      })
      .otherwise({redirectTo: '/'});
  }]);
})(window.global);
