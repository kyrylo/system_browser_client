(function(global) {
  'use strict';

  var MethodService = function(socket, Request) {
    this.socket = socket;
    this.Request = Request;
  };

  MethodService.prototype.constructor = MethodService;

  MethodService.prototype.getAllFrom = function(behaviour) {
    var req = new this.Request('get', 'method', behaviour);
    return this.socket.send(req);
  };

  global.app.method.service('MethodService', [
    'socket',
    'Request',
    MethodService]);
})(window.global);
