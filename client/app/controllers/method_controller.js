(function(global) {
  'use strict';

  var _ = require('underscore');

  var controller = function($scope, MethodGroup, Method) {
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

    $scope.$on('get:method:all', function(_event1, behaviour) {
      var name = 'add:method:' + behaviour.name;

      if (!$scope.$$listeners.hasOwnProperty(name)) {
        $scope.$on(name, function(_event2, methods) {
          $scope.$parent.$broadcast('reset-source');

          if (methods.length === 0) {
            $scope.$apply(function() {
              $scope.items = ['No methods found'];
            });
          } else {
            $scope.$apply(function() {
              methodGroup = MethodGroup.new(methods, behaviour.name);
              $scope.$parent.$broadcast('add:method-group', methodGroup);

              retrieveMethods(document.querySelector('#main-toolbar input').checked);
            });
          }
        });
      }

      Method.getAllFrom(behaviour.name);
    });

    $scope.$on('reset-methods', function() {
      $scope.items = [];
    });

    $scope.$on('class-side-checkbox', function(_event, showClassSide) {
      if (methodGroup === undefined) {
        return;
      }

      $scope.$parent.$broadcast('add:method-group', methodGroup);
      retrieveMethods(showClassSide);
    });

    $scope.$on('filter:method', function(_event, group) {
      if (document.querySelector('#main-toolbar input').checked) {
        $scope.items = methodGroup.classMethodsInGroup(group.name);
      } else {
        $scope.items = methodGroup.instanceMethodsInGroup(group.name);
      }
    });

    $scope.$on('list-box:method:selected', function() {
      $scope.items.forEach(function(method) {
        method.selected = false;
      });
    });

    $scope.getSublist = function(method) {
      $scope.$parent.$broadcast('get:source', methodGroup.owner, method);
    };

    $scope.select = function(method) {
      $scope.$emit('list-box:method:selected');
      method.selected = true;
    };
  };

  global.app.controller('MethodController', [
    '$scope',
    'MethodGroup',
    'Method',
    controller]);
})(window.global);
