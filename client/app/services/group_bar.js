(function(global) {
  'use strict';

  var GroupBar = function() {
    this.domElement = document.querySelector('#group-bar .switch input');
  };

  GroupBar.prototype.constructor = GroupBar;

  GroupBar.prototype.classSideChecked = function() {
    return this.domElement.checked;
  };

  GroupBar.prototype.setInstanceSide = function() {
    this.domElement.checked = false;
  };

  global.app.service('GroupBar', [GroupBar]);
})(window.global);
