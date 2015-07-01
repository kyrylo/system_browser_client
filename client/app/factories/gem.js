(function(global) {
  'use strict';

  var factory = function(Request, socket) {
    return {
      getAll: function() {
        var req = new Request('get', 'gem', 'all');
        socket.write(req.to_json());
      },

      open: function(gem_name) {
        var req = new Request('open', 'gem', gem_name);
        socket.write(req.to_json());
      }
    };
  };

  global.app.factory('Gem', ['Request', 'socket', factory]);
})(window.global);
