(function(global) {
  'use strict';

  var Request = function(action, resource, scope, other) {
    this.body = {
      callbackId: null,
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

  Request.prototype.setCallbackId = function(callbackId) {
    this.body.callbackId = callbackId;
  };

  var factory = function() {
    return Request;
  };

  global.app.factory('Request', [
    factory
  ]);
})(window.global);
