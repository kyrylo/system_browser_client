(function(global) {
  'use strict';

  var initService = function(Request, socket) {
    this.Request = Request;
    this.socket = socket;
  };

  initService.prototype.constructor = initService;

  initService.prototype.sendPid = function(pid) {
    var req = new this.Request('set-window-pid', pid);
    this.socket.send(req);
  };

  global.app.service('initService', [
    'Request',
    'socket',
    initService
  ]);
})(window.global);
