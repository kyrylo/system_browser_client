(function(global) {
  'use strict';

  var BehaviourService = function(socket, Request) {
    this.socket = socket;
    this.Request = Request;
  };

  BehaviourService.prototype.constructor = BehaviourService;

  BehaviourService.prototype.getAllFrom = function(gemName) {
    var req = new this.Request('get', 'behaviour', gemName);
    this.socket.write(req.to_json());
  };

  BehaviourService.prototype.openClass = function(behaviour) {
    var req = new this.Request('autoget', 'behaviour', behaviour);
    this.socket.write(req.to_json());
  };

  global.app.behaviour.service('behaviourService', [
    'socket',
    'Request',
    BehaviourService]);
})(window.global);
