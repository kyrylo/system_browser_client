(function(global) {
  'use strict';

  var factory = function(Request, socket) {
    return {
      getAll: function() {
        var req = Request.new('get', 'gem', 'all');
        socket.write(req.to_json());
      }
    };
  };

  global.app.factory('Gem', ['Request', 'socket', factory]);
})(window.global);
