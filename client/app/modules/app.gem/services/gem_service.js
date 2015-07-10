(function(global) {
  'use strict';
  var GemService = function(socket, Request) {
    this.socket = socket;
    this.Request = Request;
  };

  GemService.prototype.constructor = GemService;

  GemService.prototype.getAll = function() {
    var req = new this.Request('get', 'gem', 'all');
    this.socket.send(req);
  };

  GemService.prototype.open = function(gemName) {
    var req = new this.Request('open', 'gem', gemName);
    this.socket.send(req);
  };

  GemService.prototype.getDescription = function(gemName) {
    var req = new this.Request('description', 'gem', gemName);
    this.socket.send(req);
  };

  global.app.gem.service('GemService', [
    'socket',
    'Request',
    GemService]);
})(window.global);
