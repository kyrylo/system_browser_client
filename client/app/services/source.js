(function(global) {
  'use strict';

  var Source = function(Request, socket) {
    this.Request = Request;
    this.socket = socket;
  };

  Source.prototype.constructor = Source;

  Source.prototype.extract = function(methodOwner, methodName) {
    var params = {
      owner: methodOwner,
      method: methodName
    };

    var req = new this.Request('get', 'source', 'with-comment', params);
    this.socket.send(req);
  };

  global.app.service('source', ['Request', 'socket', Source]);
})(window.global);
