(function(global) {
  'use strict';

  var factory = function(Request, socket) {
    return {
      getAllFrom: function(behaviourName) {
        var req = Request.new('get', 'method', behaviourName);
        socket.write(req.to_json());
      }
    };
  };

  global.app.factory('Method', ['Request', 'socket', factory]);
})(window.global);
