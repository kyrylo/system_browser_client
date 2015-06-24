/*global angular*/
var net = require('net'),
    events = require('events');

var dependencies = [
  'ngRoute'
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

var Request = function(action, resource, scope) {
  this.body = {
    system_browser_server: {
      action: action,
      resource: resource,
      scope: scope
    }
  };
};
Request.prototype.constructor = Request;

Request.prototype.to_json = function() {
  return JSON.stringify(this.body) + '\n';
};

systemBrowser
  .factory('gemFactory', ['socket', function(socket) {
  return {
    getGems: function() {
      var req = new Request('get', 'gem', 'all');
      socket.write(req.to_json());
    }
  };
}]);

systemBrowser
  .factory('behaviourFactory', ['socket', function(socket) {
  return {
    getBehaviours: function(gem_name) {
      var req = new Request('get', 'behaviour', gem_name);
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

var BehaviourController = function($scope, emitter, behaviourFactory) {
  emitter.on('get:behaviour:all', function(gem_name) {
    emitter.once('add:behaviour:' + gem_name, function(behaviours) {
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
};

var GroupController = function($scope) {
};

var MethodController = function($scope) {
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

systemBrowser.controller('GemController',
                         ['$scope', 'emitter', 'gemFactory', GemController]);
systemBrowser.controller('BehaviourController',
                         ['$scope', 'emitter', 'behaviourFactory', BehaviourController]);
systemBrowser.controller('GroupController', ['$scope', GroupController]);
systemBrowser.controller('MethodController', ['$scope', MethodController]);

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
