(function(global) {
  'use strict';

  var Toolbar = function() {
  };

  Toolbar.prototype.constructor = Toolbar;

  global.app.service('toolbar', [Toolbar]);
})(window.global);
