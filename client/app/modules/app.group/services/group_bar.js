(function(global) {
  'use strict';

  var GroupBar = function() {
    this.selName = '#group-bar .squared-checkbox input';
  };

  GroupBar.prototype.constructor = GroupBar;

  GroupBar.prototype.isClassSide = function() {
    return document.querySelector(this.selName).checked;
  };

  global.app.group.service('groupBar', [GroupBar]);
})(window.global);
