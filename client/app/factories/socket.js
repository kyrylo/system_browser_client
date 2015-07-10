(function(global) {
  'use strict';

  var net = require('net');

  var socket = new net.Socket();

  socket.connect(9696, '127.0.0.1', function() {
    console.log('Connected to 127.0.0.1:9696');
  });

  socket.send = function(request) {
    var defer = this.$q.defer(),
        callbackId = this.callbackStoreService.set(defer);

    request.setCallbackId(callbackId);
    socket.write(request.to_json());

    return defer.promise;
  };

  var factory = function($q, callbackStoreService) {
    socket.$q = $q;
    socket.callbackStoreService = callbackStoreService;

    return socket;
  };

  global.app.factory('socket', [
    '$q',
    'callbackStoreService',
    factory
  ]);
})(window.global);
