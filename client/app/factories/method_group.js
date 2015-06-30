(function(global) {
  'use strict';

  var MethodGroup = function(methods, owner, Group) {
    this.owner = owner;

    this.publicInstance = methods.public.instance;
    this.publicClass = methods.public.singleton;

    this.privateInstance = methods.private.instance;
    this.privateClass = methods.private.singleton;

    this.protectedInstance = methods.protected.instance;
    this.protectedClass = methods.protected.singleton;

    this.groups = Group;
  };

  MethodGroup.prototype.constructor = MethodGroup;

  MethodGroup.prototype.instanceMethods = function() {
    var methods = [];

    methods = methods.concat(this.publicInstance);
    methods = methods.concat(this.privateInstance);
    methods = methods.concat(this.protectedInstance);

    return methods.map(function(method) {
      return {name: '#' + method};
    });
  };

  MethodGroup.prototype.classMethods = function() {
    var methods = [];

    methods = methods.concat(this.publicClass);
    methods = methods.concat(this.privateClass);
    methods = methods.concat(this.protectedClass);

    return methods.map(function(method) {
      return {name: '.' + method};
    });
  };

  MethodGroup.prototype.anyPublicMethods = function(ctx) {
    if (ctx == 'instance') {
      return this.publicInstance.length !== 0;
    } else if (ctx == 'singleton') {
      return this.publicClass.length !== 0;
    } else {
      throw new Error('unknown context: ' + ctx);
    }
  };

  MethodGroup.prototype.anyPrivateMethods = function(ctx) {
    if (ctx == 'instance') {
      return this.privateInstance.length !== 0;
    } else if (ctx == 'singleton') {
      return this.privateClass.length !== 0;
    } else {
      throw new Error('unknown context: ' + ctx);
    }
  };

  MethodGroup.prototype.anyProtectedMethods = function(ctx) {
    if (ctx == 'instance') {
      return this.protectedInstance.length !== 0;
    } else if (ctx == 'singleton') {
      return this.protectedClass.length !== 0;
    } else {
      throw new Error('unknown context: ' + ctx);
    }
  };

  MethodGroup.prototype.classMethodsInGroup = function(group) {
    var methods = [];

    if (group === this.groups.labels.all) {
      methods = this.classMethods();
    }

    if (group === this.groups.labels.public) {
      methods = this.publicClass.map(function(method) {
        return {name: '.' + method};
      });
    }

    if (group === this.groups.labels.private) {
      methods = this.privateClass.map(function(method) {
        return {name: '.' + method};
      });
    }

    if (group === this.groups.labels.protected) {
      methods = this.protectedClass.map(function(method) {
        return {name: '.' + method};
      });
    }

    return methods;
  };

  MethodGroup.prototype.instanceMethodsInGroup = function(group) {
    var methods = [];

    if (group === this.groups.labels.all) {
      methods = this.instanceMethods();
    }

    if (group === this.groups.labels.public) {
      methods = this.publicInstance.map(function(method) {
        return {name: '#' + method};
      });
    }

    if (group === this.groups.labels.private) {
      methods = this.privateInstance.map(function(method) {
        return {name: '#' + method};
      });
    }

    if (group === this.groups.labels.protected) {
      methods = this.protectedInstance.map(function(method) {
        return {name: '#' + method};
      });
    }

    return methods;
  };

  var factory = function(Group) {
    return {
      new: function(methods, owner) {
        return new MethodGroup(methods, owner, Group);
      }
    };
  };

  global.app.factory('MethodGroup', ['Group', factory]);
})(window.global);
