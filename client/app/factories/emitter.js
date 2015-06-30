(function(global) {
  'use strict';

  var events = require('events');

  var factory = function() {
    return new events.EventEmitter();
  };

  global.app.factory('emitter', [factory]);
})(window.global);
