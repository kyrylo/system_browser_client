(function(global) {
  'use strict';

  var controller = function($scope, $rootScope, $timeout, socket, eventLoop) {
    socket.on('data', eventLoop.init());

    $rootScope.$on('init', function() {
      $timeout(function() {
        $scope.$broadcast('get:gem:all');
      });
    });
  };

  global.app.controller('MainController', [
    '$scope',
    '$rootScope',
    '$timeout',
    'socket',
    'eventLoop',
    controller]);
})(window.global);
