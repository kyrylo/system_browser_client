(function(global) {
  'use strict';

  var controller = function($scope, $rootScope, socket, EventLoop) {
    socket.on('data', EventLoop.init());

    $rootScope.$on('init', function() {
      $scope.$broadcast('get:gem:all');
    });
  };

  global.app.controller('MainController', [
    '$scope',
    '$rootScope',
    'socket',
    'EventLoop',
    controller]);
})(window.global);
