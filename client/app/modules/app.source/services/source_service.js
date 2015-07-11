(function(global) {
  'use strict';

  var sourceService = function(Request, socket) {
    this.Request = Request;
    this.socket = socket;
  };

  sourceService.prototype.constructor = sourceService;

  sourceService.prototype.extract = function(methodOwner, methodName) {
    var params = {
      owner: methodOwner,
      method: methodName
    };

    var req = new this.Request('get', 'source', 'with-comment', params);
    this.socket.send(req);
  };

  global.app.source.service('sourceService', [
    'Request',
    'socket',
    sourceService
  ]);
})(window.global);
