(function(global) {
  'use strict';

  var GroupBar = function() {
    this.reset();
  };

  GroupBar.prototype.constructor = GroupBar;

  GroupBar.prototype.reset = function() {
    this.hide();
    this.setInstanceSide();
  };

  GroupBar.prototype.hide = function() {
    this.visible = false;
  };

  GroupBar.prototype.show = function() {
    this.visible = true;
  };

  GroupBar.prototype.toggleSide = function() {
    if (this.classSide) {
      this.setInstanceSide();
    } else {
      this.setClassSide();
    }
  };

  GroupBar.prototype.setInstanceSide = function() {
    this.classSide = false;
  };

  GroupBar.prototype.setClassSide = function() {
    this.classSide = true;
  };

  global.app.service('groupBar', [
    GroupBar
  ]);
})(window.global);
