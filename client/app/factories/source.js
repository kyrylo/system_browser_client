(function(global) {
  'use strict';

  var factory = function(Request, socket) {
    return {
      getSource: function(methodOwner, methodName) {
        var params = {
          owner: methodOwner,
          method: methodName
        };

        var req = Request.new('get', 'source', 'with-comment', params);
        socket.write(req.to_json());
      }
    };
  };

  global.app.factory('Source', ['Request', 'socket', factory]);
})(window.global);
