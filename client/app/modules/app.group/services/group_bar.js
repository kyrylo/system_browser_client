(function(global) {
  'use strict';

  var GroupBar = function() {
    this.reset();
  };

  GroupBar.prototype.constructor = GroupBar;

  GroupBar.prototype.reset = function() {
    this.visible = false;
    this.classSide = false;
  };

  GroupBar.prototype.hide = function() {
    this.visible = false;
  };

  GroupBar.prototype.show = function() {
    this.visible = true;
  };

  GroupBar.prototype.setInstanceSide = function() {
    this.classSide = false;
  };

  GroupBar.prototype.setClassSide = function() {
    this.classSide = true;
  };

  global.app.service('groupBar', [GroupBar]);
})(window.global);
