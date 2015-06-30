(function(global) {
  'use strict';

  var factory = function(Request, socket) {
    return {
      getAllFrom: function(gemName) {
        var req = new Request('get', 'behaviour', gemName);
        socket.write(req.to_json());
      }
    };
  };

  global.app.factory('Behaviour', ['Request', 'socket', factory]);
})(window.global);
