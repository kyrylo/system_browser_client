(function(global) {
  'use strict';

  var _ = require('underscore');

  var factory = function() {
    return _;
  };

  global.app.factory('_', [factory]);
})(window.global);
