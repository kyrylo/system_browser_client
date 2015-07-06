(function(global) {
  'use strict';

  var _ = require('underscore');

  var factory = function() {
    return _;
  };

  global.underscore.factory('_', [factory]);
})(window.global);
