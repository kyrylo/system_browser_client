(function(global, process, require) {
  'use strict';

  var controller = function($scope, $rootScope, $timeout, socket, eventLoop,
                            initService) {
    var gui = require('nw.gui');
    var win = gui.Window.get();

    process.on('SIGINT', function() {
      console.log('Received SIGINT, bye-bye!');
      gui.App.quit();
    });

    win.on('close', function() {
      console.log('Shutting down the client normally...');
      socket.end('FIN');
      this.close(true);
    });

    socket.on('data', eventLoop.init());

    $rootScope.$on('init', function() {
      $timeout(function() {
        initService.sendPid(process.pid);
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
    'initService',
    controller]);
})(window.global, window.process, window.require);
