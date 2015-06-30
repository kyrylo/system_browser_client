/*jshint -W054 */

(function(global) {
  'use strict';

  var controller = function($scope, $controller, socket, emitter, Gem,
                            EventLoop) {
    var gem = $scope.$new(),
        behaviour = $scope.$new(),
        group = $scope.$new(),
        method = $scope.$new();

    var GemCtrl = new Function(),
        BehaviourCtrl = new Function(),
        GroupCtrl = new Function(),
        MethodCtrl = new Function();

    GemCtrl.prototype = gem;
    BehaviourCtrl.prototype = behaviour;
    GroupCtrl.prototype = group;
    MethodCtrl.prototype = method;

    $controller('GemController', {$scope: gem});
    $controller('BehaviourController', {$scope: behaviour});
    $controller('GroupController', {$scope: group});
    $controller('MethodController', {$scope: method});

    $scope.panes = [
      {name: 'gem', controller: GemCtrl},
      {name: 'behaviour', controller: BehaviourCtrl},
      {name: 'group', controller: GroupCtrl},
      {name: 'method', controller: MethodCtrl}
    ];

    socket.on('data', EventLoop.init());

    emitter.on('init', function() {
      emitter.emit('get:gem:all');
    });
  };

  global.app.controller('MainController', [
    '$scope',
    '$controller',
    'socket',
    'emitter',
    'Gem',
    'EventLoop',
    controller]);
})(window.global);
