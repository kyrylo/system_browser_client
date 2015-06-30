(function(global) {
  'use strict';

  var EventLoop = function(socket, emitter, MessageDispatcher) {
    this.socket = socket;
    this.emitter = emitter;
    this.dispatcher = MessageDispatcher;
  };

  EventLoop.prototype.constructor = EventLoop;

  EventLoop.prototype.init = function() {
    var that = this;

    return function(data) {
      var messages = that.dispatcher.dispatch(data);

      messages.forEach(function(message) {
        this.emitter.emit(message.action, message.data);
      }, that);
    };
  };

  var factory = function(socket, emitter, MessageDispatcher) {
    return new EventLoop(socket, emitter, MessageDispatcher);
  };

  global.app.factory('EventLoop', [
    'socket',
    'emitter',
    'MessageDispatcher',
    factory]);
})(window.global);
