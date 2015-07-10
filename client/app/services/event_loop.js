(function(global) {
  'use strict';

  var EventLoop = function($rootScope, socket, messageDispatcher,
                           callbackStoreService) {
    this.$rootScope = $rootScope;
    this.socket = socket;
    this.dispatcher = messageDispatcher;
    this.callbackStoreService = callbackStoreService;
  };

  EventLoop.prototype.constructor = EventLoop;

  EventLoop.prototype.init = function() {
    var that = this;

    return function(data) {
      var messages = that.dispatcher.dispatch(data);

      messages.forEach(function(message) {
        var data = message.data,
            cb = that.callbackStoreService.get(message.callbackId);

        if (cb === null) {
          that.$rootScope.$broadcast(data.action, data.data);
          return cb;
        } else {
          return that.$rootScope.$apply(cb.callback.resolve(data));
        }
      });
    };
  };

  global.app.service('eventLoop', [
    '$rootScope',
    'socket',
    'messageDispatcher',
    'callbackStoreService',
    EventLoop]);
})(window.global);
