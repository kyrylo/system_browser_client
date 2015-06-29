/*global angular*/
var net = require('net'),
    events = require('events'),
    _ = require('underscore');


var dependencies = [
  'ngRoute',
  'ui.layout'
];

var systemBrowser = angular.module('systemBrowser', dependencies);

systemBrowser.config(['$routeProvider', function($routeProvider) {
  $routeProvider
    .when('/',
          {
            controller: 'MainController',
            templateUrl: 'assets/partials/main_view.html'
          })
    .otherwise({redirectTo: '/'});
}]);

systemBrowser.factory('emitter', function() {
  return new events.EventEmitter();
});

systemBrowser.factory('socket', function() {
  var socket = new net.Socket();

  socket.connect(9696, '127.0.0.1', function() {
    console.log('Connected to 127.0.0.1:9696');
  });

  return socket;
});

var Request = function(action, resource, scope, other) {
  this.body = {
    system_browser_server: {
      action: action,
      resource: resource,
      scope: scope,
      other: other
    }
  };
};
Request.prototype.constructor = Request;

Request.prototype.to_json = function() {
  return JSON.stringify(this.body) + '\n';
};

systemBrowser.factory('gemFactory', ['socket', function(socket) {
  return {
    getGems: function() {
      var req = new Request('get', 'gem', 'all');
      socket.write(req.to_json());
    }
  };
}]);

systemBrowser.factory('behaviourFactory', ['socket', function(socket) {
  return {
    getBehaviours: function(gem_name) {
      var req = new Request('get', 'behaviour', gem_name);
      socket.write(req.to_json());
    }
  };
}]);

systemBrowser.factory('methodFactory', ['socket', function(socket) {
  return {
    getMethods: function(behaviour) {
      var req = new Request('get', 'method', behaviour);
      socket.write(req.to_json());
    }
  };
}]);

systemBrowser.factory('sourceFactory', ['socket', function(socket) {
  return {
    getSource: function(owner, method) {
      var params = {owner: owner, method: method};
      var req = new Request('get', 'source', 'with-comment', params);
      socket.write(req.to_json());
    }
  };
}]);

systemBrowser.factory('groupFactory', [function() {
  return {
    getAll: function() {
      return '-- all --';
    },

    getPublic: function() {
      return 'public';
    },

    getPrivate: function() {
      return 'private';
    },

    getProtected: function() {
      return 'protected';
    }
  };
}]);

var GemController = function($scope, emitter, gemFactory) {
  emitter.on('get:gem:all', function() {
    gemFactory.getGems();
  });

  emitter.on('add:gem:all', function(gems) {
    var ruby_gems = gems.slice(2, gems.length);
    var core_gems = gems.slice(0, 2);

    $scope.items = core_gems.concat(_.sortBy(ruby_gems, 'name'));
  });

  $scope.getSublist = function(gem) {
    emitter.emit('get:behaviour:all', gem);
  };
};

var BehaviourController = function($scope, $rootScope, emitter, behaviourFactory) {
  emitter.on('get:behaviour:all', function(gem) {
    emitter.once('add:behaviour:' + gem.name, function(behaviours) {
      $rootScope.$emit('reset-methods');
      $rootScope.$emit('reset-source');

      if (behaviours.length === 0) {
        $scope.$apply(function() {
          $scope.items = [{name: 'No behaviours found'}];
        });
      } else {
        $scope.$apply(function() {
          $scope.items = _.sortBy(behaviours, 'name');
        });
      }
    });

    behaviourFactory.getBehaviours(gem.name);
  });

  $scope.getSublist = function(behaviour) {
    emitter.emit('get:method:all', behaviour);
  };
};

var GroupController = function($scope, $rootScope, groupFactory) {
  $rootScope.$on('add:method-group', function(_event, methodGroup) {
    var ctx;
    var groups = [];

    if (document.querySelector('#main-toolbar input').checked) {
      ctx = 'singleton';
    } else {
      ctx = 'instance';
    }

    if (methodGroup.anyPublicMethods(ctx)) {
      groups.push({name: groupFactory.getPublic()});
    }


    if (methodGroup.anyPrivateMethods(ctx)) {
      groups.push({name: groupFactory.getPrivate()});
    }

    if (methodGroup.anyProtectedMethods(ctx)) {
      groups.push({name: groupFactory.getProtected()});
    }

    if (groups.length > 0) {
      groups.unshift({name: groupFactory.getAll()});
    }

    $scope.items = groups;
  });

  $rootScope.$on('reset-methods', function() {
    $scope.items = [];
  });

  $scope.getSublist = function(group) {
    $rootScope.$emit('filter:method', group);
  };
};

var MethodController = function($scope, $rootScope, emitter, methodFactory) {
  var methodGroup;

  var retrieveMethods = function(showClassSide) {
    var methods;

    if (showClassSide) {
      methods = methodGroup.classMethods();
    } else {
      methods = methodGroup.instanceMethods();
    }

    $scope.items = _.sortBy(methods, 'name');
  };

  emitter.on('get:method:all', function(behaviour) {
    emitter.once('add:method:' + behaviour.name, function(methods) {
      $rootScope.$emit('reset-source');

      if (methods.length === 0) {
        $scope.$apply(function() {
          $scope.items = ['No methods found'];
        });
      } else {
        $scope.$apply(function() {
          methodGroup = new MethodGroup(methods, behaviour.name);
          $rootScope.$emit('add:method-group', methodGroup);

          retrieveMethods(document.querySelector('#main-toolbar input').checked);
        });
      }
    });

    methodFactory.getMethods(behaviour.name);
  });

  $rootScope.$on('reset-methods', function() {
    $scope.items = [];
  });

  $rootScope.$on('class-side-checkbox', function(_event, showClassSide) {
    if (methodGroup === undefined)
      return;

    $rootScope.$emit('add:method-group', methodGroup);
    retrieveMethods(showClassSide);
  });

  $rootScope.$on('filter:method', function(_event, group) {
    if (document.querySelector('#main-toolbar input').checked) {
      $scope.items = methodGroup.classMethodsInGroup(group.name);
    } else {
      $scope.items = methodGroup.instanceMethodsInGroup(group.name);
    }
  });

  $scope.getSublist = function(method) {
    $rootScope.$emit('get:source', methodGroup.owner, method);
  };
};

var SourceController = function($scope, $rootScope, emitter, sourceFactory) {
  $rootScope.$on('get:source', function(_event, owner, method) {
    emitter.once('add:source:with-comment', function(source) {
      $scope.$apply(function() {
        $scope.source = source;
      });
    });

    sourceFactory.getSource(owner, method);
  });

  $rootScope.$on('reset-source', function() {
    $scope.source = null;
  });
};

var MainToolbarController = function($scope, $rootScope) {
  $scope.toggleClassSide = function() {
    $rootScope.$emit('class-side-checkbox', $scope.toolbar.classSide);
  };
};

var MessageDispatcher = function() {
};
MessageDispatcher.prototype.constructor = MessageDispatcher;

MessageDispatcher.prototype.dispatch = function(data) {
  var dataArray, messages;

  dataArray = data.toString().split('\n');

  messages = dataArray.filter(function(elem) {
    return elem === 0 || elem;
  });

  return messages.map(function(message) {
    var msg = JSON.parse(message);
    return msg.system_browser_client;
  });
};

var EventLoop = function(socket, emitter) {
  this.socket = socket;
  this.emitter = emitter;
};
EventLoop.prototype.constructor = EventLoop;

EventLoop.prototype.init = function() {
  var that = this;

  return function(data) {
    var messages = new MessageDispatcher().dispatch(data);

    messages.forEach(function(message) {
      this.emitter.emit(message.action, message.data);
    }, that);
  };
};

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
  if (ctx == 'instance')
    return this.publicInstance.length !== 0;
  else if (ctx == 'singleton')
    return this.publicClass.length !== 0;
  else
    throw new Error('unknown context: ' + ctx);
};

MethodGroup.prototype.anyPrivateMethods = function(ctx) {
  if (ctx == 'instance')
    return this.privateInstance.length !== 0;
  else if (ctx == 'singleton')
    return this.privateClass.length !== 0;
  else
    throw new Error('unknown context: ' + ctx);
};

MethodGroup.prototype.anyProtectedMethods = function(ctx) {
  if (ctx == 'instance')
    return this.protectedInstance.length !== 0;
  else if (ctx == 'singleton')
    return this.protectedClass.length !== 0;
  else
    throw new Error('unknown context: ' + ctx);
};

MethodGroup.prototype.classMethodsInGroup = function(group) {
  var methods = [];

  if (group === '-- all --') {
    methods = this.classMethods();
  }

  if (group === 'public') {
    methods = this.publicClass.map(function(method) {
      return {name: '.' + method};
    });
  }

  if (group === 'private') {
    methods = this.privateClass.map(function(method) {
      return {name: '.' + method};
    });
  }

  if (group === 'protected') {
    methods = this.protectedClass.map(function(method) {
      return {name: '.' + method};
    });
  }

  return methods;
};

MethodGroup.prototype.instanceMethodsInGroup = function(group) {
  var methods = [];

  if (group === '-- all --') {
    methods = this.instanceMethods();
  }

  if (group === 'public') {
    methods = this.publicInstance.map(function(method) {
      return {name: '#' + method};
    });
  }

  if (group === 'private') {
    methods = this.privateInstance.map(function(method) {
      return {name: '#' + method};
    });
  }

  if (group === 'protected') {
    methods = this.protectedInstance.map(function(method) {
      return {name: '#' + method};
    });
  }

  return methods;
};

systemBrowser.controller('GemController',
                         ['$scope', 'emitter', 'gemFactory', GemController]);
systemBrowser.controller('BehaviourController',
                         ['$scope', '$rootScope', 'emitter', 'behaviourFactory', BehaviourController]);
systemBrowser.controller('GroupController',
                         ['$scope', GroupController]);
systemBrowser.controller('MethodController',
                         ['$scope', '$rootScope', 'emitter', 'methodFactory', MethodController]);

systemBrowser.controller('SourceController',
                         ['$scope', '$rootScope', 'emitter', 'sourceFactory', SourceController]);
systemBrowser.controller('MainToolbarController',
                         ['$scope', '$rootScope', MainToolbarController]);

systemBrowser
  .controller('MainController',
              ['$scope', 'socket', 'emitter',
               function ($scope, socket, emitter, gemFactory) {
                 $scope.panes = [
                   {name: 'gem', controller: GemController},
                   {name: 'behaviour', controller: BehaviourController},
                   {name: 'group', controller: GroupController},
                   {name: 'method', controller: MethodController}
                 ];

                 socket.on('data', new EventLoop(socket, emitter).init());

                 emitter.on('init', function() {
                   emitter.emit('get:gem:all');
                 });
               }]);
