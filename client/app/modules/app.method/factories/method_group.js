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

    return this.prepForDisplay(methods, this.methodToInstanceMethod);
  };

  MethodGroup.prototype.classMethods = function() {
    var methods = [];

    methods = methods.
      concat(this.publicClass).
      concat(this.privateClass).
      concat(this.protectedClass);

    return this.prepForDisplay(methods, this.methodToClassMethod);
  };

  MethodGroup.prototype.execInCtx = function(ctx, collection1, collection2) {
    if (ctx == 'instance') {
      return collection1;
    } else if (ctx == 'singleton') {
      return collection2;
    } else {
      throw new Error('unknown context: ' + ctx);
    }
  };

  MethodGroup.prototype.onlyCMethods = function(collection) {
    return collection.filter(function(method) { return method.c_method; });
  };

  MethodGroup.prototype.onlyRbMethods = function(collection) {
    return collection.filter(function(method) { return !method.c_method; });
  };

  MethodGroup.prototype.anyPublicMethods = function(ctx) {
    var collection = this.execInCtx(ctx, this.publicInstance, this.publicClass);

    return collection.length > 0;
  };

  MethodGroup.prototype.anyPrivateMethods = function(ctx) {
    var collection = this.execInCtx(ctx, this.privateInstance, this.privateClass);

    return collection.length > 0;
  };

  MethodGroup.prototype.anyProtectedMethods = function(ctx) {
    var collection = this.execInCtx(ctx, this.protectedInstance, this.protectedClass);

    return collection.length > 0;
  };

  MethodGroup.prototype.cInstanceMethods = function() {
    return this.onlyCMethods(this.instanceMethods());
  };

  MethodGroup.prototype.cClassMethods = function() {
    return this.onlyCMethods(this.classMethods());
  };

  MethodGroup.prototype.rbInstanceMethods = function() {
    return this.onlyRbMethods(this.instanceMethods());
  };


  MethodGroup.prototype.rbClassMethods = function() {
    return this.onlyRbMethods(this.classMethods());
  };

  MethodGroup.prototype.anyRubyMethods = function(ctx) {
    var collection = this.execInCtx(
      ctx,
      this.rbInstanceMethods(),
      this.rbClassMethods()
    );

    return collection.length > 0;
  };

  MethodGroup.prototype.anyCMethods = function(ctx) {
    var collection = this.execInCtx(
      ctx,
      this.cInstanceMethods(),
      this.cClassMethods()
    );

    return collection.length > 0;
  };

  MethodGroup.prototype.prepForDisplay = function(methods, prepFunc) {
    return methods.map(function(method) {
      method.displayName = prepFunc(method);
      return method;
    }, this);
  };

  MethodGroup.prototype.methodsInGroup = function(group, ctx) {
    var allFunc, pub, priv, prot, cMethFunc, rbMethFunc, prepFunc;

    var methods = [];
    var labels = this.group.labels;

    allFunc = this[ctx.toLowerCase() + 'Methods'];
    pub = this[labels.public + ctx];
    priv = this[labels.private + ctx];
    prot = this[labels.protected + ctx];
    cMethFunc = this['c' + ctx + 'Methods'];
    rbMethFunc = this['rb' + ctx + 'Methods'];
    prepFunc = this['methodTo' + ctx + 'Method'];

    switch(group) {
    case labels.all:
      methods = allFunc.bind(this)();
      break;
    case labels.public:
      methods = pub;
      break;
    case labels.private:
      methods = priv;
      break;
    case labels.protected:
      methods = prot;
      break;
    case labels.c:
      methods = cMethFunc.bind(this)();
      break;
    case labels.rb:
      methods = rbMethFunc.bind(this)();
      break;
    }

    return this.prepForDisplay(methods, prepFunc);
  };

  MethodGroup.prototype.classMethodsInGroup = function(group) {
    return this.methodsInGroup.bind(this)(group, 'Class');
  };

  MethodGroup.prototype.instanceMethodsInGroup = function(group) {
    return this.methodsInGroup.bind(this)(group, 'Instance');
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
