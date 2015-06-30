(function(global) {
  'use strict';

  var EventLoop = function($rootScope, socket, MessageDispatcher) {
    this.$rootScope = $rootScope;
    this.socket = socket;
    this.dispatcher = MessageDispatcher;
  };

  EventLoop.prototype.constructor = EventLoop;

  EventLoop.prototype.init = function() {
    var that = this;

    return function(data) {
      var messages = that.dispatcher.dispatch(data);

      messages.forEach(function(message) {
        that.$rootScope.$broadcast(message.action, message.data);
      });
    };
  };

  var factory = function(socket, emitter, MessageDispatcher) {
    return new EventLoop(socket, emitter, MessageDispatcher);
  };

  global.app.factory('EventLoop', [
    '$rootScope',
    'socket',
    'MessageDispatcher',
    factory]);
})(window.global);
