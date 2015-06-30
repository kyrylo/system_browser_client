/*jshint -W054 */

(function(global) {
  'use strict';

  var controller = function($scope, socket, emitter, EventLoop) {

    socket.on('data', EventLoop.init());

    emitter.on('init', function() {
      emitter.emit('get:gem:all');
    });
  };

  global.app.controller('MainController', [
    '$scope',
    'socket',
    'emitter',
    'EventLoop',
    controller]);
})(window.global);
