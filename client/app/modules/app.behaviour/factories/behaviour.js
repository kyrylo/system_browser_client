(function(global) {
  'use strict';

  var Behaviour = function(behaviour) {
    this.selected = false;
    this.name = behaviour.name;
    this.isModule = behaviour.isModule;
    this.isException = behaviour.isException;
    this.name = behaviour.name;
    this.namespacesLen = 0;

    this.setIcon();

    if (this.name) {
      this.setDisplayName();
    }
  };

  Behaviour.prototype.constructor = Behaviour;

  Behaviour.prototype.setDisplayName = function() {
    var namespaces;

    if (/^[^A-Z]/.test(this.name)) {
      // A feeble attempt at supporting behaviours
      // with redefined #name
      this.displayName = this.name;
    } else {
      namespaces = this.name.split('::');
      this.namespacesLen = namespaces.length;
      this.displayName = namespaces[this.namespacesLen - 1];
    }
  };

  Behaviour.prototype.setIcon = function() {
    var icon;

    if (this.isModule) {
      icon = 'module';
    } else if (this.isException) {
      icon = 'exception';
    } else {
      icon = 'class';
    }

    this.icon = icon;
  };

  Behaviour.prototype.indent = function($sce) {
    var indent = new Array(this.namespacesLen).join(' &bull; ');
    this.indentation = $sce.trustAsHtml(indent);
  };

  var factory = function() {
    return Behaviour;
  };

  global.app.factory('Behaviour', [factory]);
})(window.global);
