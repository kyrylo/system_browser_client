(function(global) {
  'use strict';

  var GroupBar = function() {
    this.domElement = document.querySelector('#group-bar .squared-checkbox input');
  };

  GroupBar.prototype.constructor = GroupBar;

  GroupBar.prototype.classSideChecked = function() {
    return this.domElement.checked;
  };

  global.app.service('GroupBar', [GroupBar]);
})(window.global);
