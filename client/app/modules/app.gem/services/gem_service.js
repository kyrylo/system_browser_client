(function(global) {
  'use strict';

  var gemService = function($rootScope, $q, socket, Request) {
    this.$rootScope = $rootScope;
    this.$q = $q;
    this.socket = socket;
    this.Request = Request;
  };

  gemService.prototype.constructor = gemService;

  gemService.prototype.getAll = function() {
    var req = new this.Request('get', 'gem', 'all');
    return this.socket.send(req);
  };

  gemService.prototype.open = function(gemName) {
    var req = new this.Request('open', 'gem', gemName);
    this.socket.send(req);
  };

  gemService.prototype.getDescription = function(gemName) {
    var req = new this.Request('description', 'gem', gemName);
    return this.socket.send(req);
  };

  gemService.prototype.selectGem = function(gemName) {
    var deferred = this.$q.defer();

    this.$rootScope.$broadcast('select-gem', deferred, gemName);

    return deferred.promise;
  };

  gemService.prototype.getSelectedGem = function() {
    var deferred = this.$q.defer();

    this.$rootScope.$broadcast('get-selected-gem', deferred);

    return deferred.promise;
  };

  global.app.gem.service('gemService', [
    '$rootScope',
    '$q',
    'socket',
    'Request',
    gemService
  ]);
})(window.global);
