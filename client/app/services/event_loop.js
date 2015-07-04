(function(global) {
  'use strict';

  var EventLoop = function($rootScope, socket, messageDispatcher) {
    this.$rootScope = $rootScope;
    this.socket = socket;
    this.dispatcher = messageDispatcher;
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

  global.app.service('eventLoop', [
    '$rootScope',
    'socket',
    'messageDispatcher',
    EventLoop]);
})(window.global);
