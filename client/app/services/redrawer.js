(function(global) {
  'use strict';

  var Redrawer = function() {
  };

  Redrawer.prototype.constructor = Redrawer;

  Redrawer.prototype.redraw = function(element) {
    // A hack to make the hidden scrollbars work properly
    element.style.display = 'none';
    element.offsetHeight;
    element.style.display = '';
  };

  global.app.service('Redrawer', [Redrawer]);
})(window.global);
