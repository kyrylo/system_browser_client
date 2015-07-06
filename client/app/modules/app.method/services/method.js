(function(global) {
  'use strict';

  var MethodService = function(socket, Request) {
    this.socket = socket;
    this.Request = Request;
  };

  MethodService.prototype.constructor = MethodService;

  MethodService.prototype.getAllFrom = function(behaviour) {
    var req = new this.Request('get', 'method', behaviour);
    this.socket.write(req.to_json());
  };

  global.app.method.service('GemService', [
    'socket',
    'Request',
    MethodService]);
})(window.global);
