(function(global) {
  'use strict';

  var factory = function(socket, Request) {
    return {
      getAllFrom: function(gemName) {
        var req = new Request('get', 'behaviour', gemName);
        socket.write(req.to_json());
      }
    };
  };

  global.app.factory('Behaviour', ['socket', 'Request', factory]);
})(window.global);
