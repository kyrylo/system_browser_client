(function(global) {
  'use strict';

  var MethodGroup = function(methods, owner) {
    this.owner = owner;

    this.publicInstance = methods.public.instance;
    this.publicClass = methods.public.singleton;

    this.privateInstance = methods.private.instance;
    this.privateClass = methods.private.singleton;

    this.protectedInstance = methods.protected.instance;
    this.protectedClass = methods.protected.singleton;
  };

  MethodGroup.prototype.constructor = MethodGroup;

  MethodGroup.prototype.methodToClassMethod = function(method) {
    return '.' + method.name;
  };

  MethodGroup.prototype.methodToInstanceMethod = function(method) {
    return '#' + method.name;
  };

  MethodGroup.prototype.instanceMethods = function() {
    var methods = [];

    methods = methods.
      concat(this.publicInstance).
      concat(this.privateInstance).
      concat(this.protectedInstance);

    return methods.map(function(method) {
      method.displayName = this.methodToInstanceMethod(method);
      return method;
    });
  };

  MethodGroup.prototype.classMethods = function() {
    var methods = [];

    methods = methods.
      concat(this.publicClass).
      concat(this.privateClass).
      concat(this.protectedClass);

    return methods.map(function(method) {
      method.displayName = this.methodToClassMethod(method);
      return method;
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

  MethodGroup.prototype.cInstanceMethods = function() {
    var methods = this.instanceMethods().filter(function(method) {
      return method.c_method;
    });

    return methods;
  };


  MethodGroup.prototype.cClassMethods = function() {
    var methods = this.classMethods().filter(function(method) {
      return method.c_method;
    });

    return methods;
  };

  MethodGroup.prototype.rbInstanceMethods = function() {
    var methods = this.instanceMethods().filter(function(method) {
      return !method.c_method;
    });

    return methods;
  };


  MethodGroup.prototype.rbClassMethods = function() {
    var methods = this.classMethods().filter(function(method) {
      return !method.c_method;
    });

    return methods;
  };

  MethodGroup.prototype.anyRubyMethods = function(ctx) {
    if (ctx == 'instance') {
      return this.rbInstanceMethods().length > 0;
    } else if (ctx == 'singleton') {
      return this.rbClassMethods().length > 0;
    } else {
      throw new Error('unknown context: ' + ctx);
    }
  };

  MethodGroup.prototype.anyCMethods = function(ctx) {
    if (ctx == 'instance') {
      return this.cInstanceMethods().length > 0;
    } else if (ctx == 'singleton') {
      return this.cClassMethods().length > 0;
    } else {
      throw new Error('unknown context: ' + ctx);
    }
  };

  MethodGroup.prototype.classMethodsInGroup = function(group) {
    var methods = [];

    if (group === this.group.labels.all) {
      methods = this.classMethods();
    }

    if (group === this.group.labels.public) {
      methods = this.publicClass.map(function(method) {
        method.displayName = this.methodToClassMethod(method);
        return method;
      });
    }

    if (group === this.group.labels.private) {
      methods = this.privateClass.map(function(method) {
        method.displayName = this.methodToClassMethod(method);
        return method;
      });
    }

    if (group === this.group.labels.protected) {
      methods = this.protectedClass.map(function(method) {
        method.displayName = this.methodToClassMethod(method);
        return method;
      });
    }

    if (group === this.group.labels.cmethods) {
      methods = this.protectedClass.map(function(method) {
        method.displayName = this.methodToClassMethod(method);
        return method;
      });
    }

    if (group === this.group.labels.cmethods) {
      methods = this.cClassMethods().map(function(method) {
        method.displayName = this.methodToClassMethod(method);
        return method;
      });
    }

    if (group === this.group.labels.rbmethods) {
      methods = this.rbClassMethods().map(function(method) {
        method.displayName = this.methodToClassMethod(method);
        return method;
      });
    }

    return methods;
  };

  MethodGroup.prototype.instanceMethodsInGroup = function(group) {
    var methods = [];

    if (group === this.group.labels.all) {
      methods = this.instanceMethods();
    }

    if (group === this.group.labels.public) {
      methods = this.publicInstance.map(function(method) {
        method.displayName = this.methodToInstanceMethod(method);
        return method;
      });
    }

    if (group === this.group.labels.private) {
      methods = this.privateInstance.map(function(method) {
        method.displayName = this.methodToInstanceMethod(method);
        return method;
      });
    }

    if (group === this.group.labels.protected) {
      methods = this.protectedInstance.map(function(method) {
        method.displayName = this.methodToInstanceMethod(method);
        return method;
      });
    }

    if (group === this.group.labels.cmethods) {
      methods = this.cInstanceMethods().map(function(method) {
        method.displayName = this.methodToInstanceMethod(method);
        return method;
      });
    }

    if (group === this.group.labels.rbmethods) {
      return this.rbInstanceMethods().map(function(method) {
        method.displayName = this.methodToInstanceMethod(method);
        return method;
      });
    }

    return methods;
  };

  var factory = function(group, _) {
    MethodGroup.prototype.group = group;
    MethodGroup.prototype._ = _;

    return MethodGroup;
  };

  global.app.method.factory('MethodGroup', [
    'group',
    '_',
    factory
  ]);
})(window.global);
