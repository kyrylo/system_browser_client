(function(global) {
  'use strict';

  var controller = function($scope, $rootScope, socket, eventLoop) {
    socket.on('data', eventLoop.init());

    $rootScope.$on('init', function() {
      $scope.$broadcast('get:gem:all');
    });
  };

  global.app.controller('MainController', [
    '$scope',
    '$rootScope',
    'socket',
    'eventLoop',
    controller]);
})(window.global);
