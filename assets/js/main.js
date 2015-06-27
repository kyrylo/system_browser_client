/*global angular*/
var net = require('net'),
    events = require('events');

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

var GemController = function($scope, emitter, gemFactory) {
  emitter.on('get:gem:all', function() {
    gemFactory.getGems();
  });

  emitter.on('add:gem:all', function(gems) {
    var ruby_gems = gems.slice(2, gems.length);
    var core_gems = gems.slice(0, 2);

    $scope.items = core_gems.concat(ruby_gems.sort());
  });

  $scope.getSublist = function(gem_name) {
    emitter.emit('get:behaviour:all', gem_name);
  };
};

var BehaviourController = function($scope, $rootScope, emitter, behaviourFactory) {
  emitter.on('get:behaviour:all', function(gem_name) {
    emitter.once('add:behaviour:' + gem_name, function(behaviours) {
      $rootScope.$emit('reset-methods');
      $rootScope.$emit('reset-source');

      if (behaviours.length === 0) {
        $scope.$apply(function() {
          $scope.items = ['No behaviours found'];
        });
      } else {
        $scope.$apply(function() {
          $scope.items = behaviours;
        });
      }
    });

    behaviourFactory.getBehaviours(gem_name);
  });

  $scope.getSublist = function(behaviour) {
    emitter.emit('get:method:all', behaviour);
  };
};

var GroupController = function($scope) {
};

var MethodController = function($scope, $rootScope, emitter, methodFactory) {
  var methodGroup;

  emitter.on('get:method:all', function(behaviour_name) {
    emitter.once('add:method:' + behaviour_name, function(methods) {
      $rootScope.$emit('reset-source');

      if (methods.length === 0) {
        $scope.$apply(function() {
          $scope.items = ['No methods found'];
        });
      } else {
        $scope.$apply(function() {
          methodGroup = new MethodGroup(methods, behaviour_name);
          $scope.items = methodGroup.instanceMethods();
        });
      }
    });

    methodFactory.getMethods(behaviour_name);
  });

  $rootScope.$on('reset-methods', function() {
    $scope.items = [];
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

  methods = methods.sort();

  return methods.map(function(method) {
    return '#' + method;
  });
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

systemBrowser
  .controller('MainController', ['$scope', 'socket', 'emitter',
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
