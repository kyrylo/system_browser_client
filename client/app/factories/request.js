(function(global) {
  'use strict';

  var Request = function(action, resource, scope, other) {
    this.body = {
      system_browser_server: {
        action: action,
        resource: resource,
        scope: scope,
        other: other
      }
    };
  };

  Request.prototype.constructor = Request;

  Request.prototype.to_json = function() {
    return JSON.stringify(this.body) + '\n';
  };

  var factory = function() {
    return {
      new: function(action, resource, scope, other) {
        return new Request(action, resource, scope, other);
      }
    };
  };

  global.app.factory('Request', [factory]);
})(window.global);
