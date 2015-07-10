(function(global) {
  'use strict';

  var callbackStoreService = function() {
    this.nextId = 0;
    this.MAX_ID = 1000;
    this.callbacks = {};
  };

  callbackStoreService.prototype.constructor = callbackStoreService;

  callbackStoreService.prototype.set = function(defer) {
    var callbackId = this.generateId();

    this.callbacks[callbackId] = {
      time: new Date(),
      callback: defer
    };

    return callbackId;
  };

  callbackStoreService.prototype.get = function(callbackId) {
    if (this.callbacks.hasOwnProperty(callbackId)) {
      var cb = this.callbacks[callbackId];
      delete this.callbacks[callbackId];

      return cb;
    } else {
      return null;
    }
  };

  callbackStoreService.prototype.generateId = function() {
    this.nextId += 1;

    if (this.nextId > this.MAX_ID) {
      this.nextId = 0;
    }

    return this.nextId;
  };

  global.app.gem.service('callbackStoreService', [
    callbackStoreService
  ]);
})(window.global);
