(function(global) {
  'use strict';

  var Toolbar = function() {
    this.domElement = document.querySelector('#main-toolbar input');
  };

  Toolbar.prototype.constructor = Toolbar;

  Toolbar.prototype.classSideChecked = function() {
    return this.domElement.checked;
  };

  global.app.service('Toolbar', [Toolbar]);
})(window.global);
