(function(global) {
  'use strict';

  var methodService = function(socket, Request) {
    this.socket = socket;
    this.Request = Request;
  };

  methodService.prototype.constructor = methodService;

  methodService.prototype.getAllFrom = function(behaviour) {
    var req = new this.Request('get', 'method', behaviour);
    return this.socket.send(req);
  };

  global.app.method.service('methodService', [
    'socket',
    'Request',
    methodService
  ]);
})(window.global);
