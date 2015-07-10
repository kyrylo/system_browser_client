(function(global) {
  'use strict';

  var GemService = function($rootScope, $q, socket, Request) {
    this.$rootScope = $rootScope;
    this.$q = $q;
    this.socket = socket;
    this.Request = Request;
  };

  GemService.prototype.constructor = GemService;

  GemService.prototype.getAll = function() {
    var req = new this.Request('get', 'gem', 'all');
    return this.socket.send(req);
  };

  GemService.prototype.open = function(gemName) {
    var req = new this.Request('open', 'gem', gemName);
    this.socket.send(req);
  };

  GemService.prototype.getDescription = function(gemName) {
    var req = new this.Request('description', 'gem', gemName);
    return this.socket.send(req);
  };

  GemService.prototype.selectGem = function(gemName) {
    var deferred = this.$q.defer();

    this.$rootScope.$broadcast('select-gem', deferred, gemName);

    return deferred.promise;
  };

  global.app.gem.service('GemService', [
    '$rootScope',
    '$q',
    'socket',
    'Request',
    GemService]);
})(window.global);
