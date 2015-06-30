(function(global) {
  'use strict';

  var _ = require('underscore');

  var controller = function($scope, $rootScope, emitter, MethodGroup, Method) {
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
            methodGroup = MethodGroup.new(methods, behaviour.name);
            $rootScope.$emit('add:method-group', methodGroup);

            retrieveMethods(document.querySelector('#main-toolbar input').checked);
          });
        }
      });

      Method.getAllFrom(behaviour.name);
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

    $rootScope.$on('list-box:method:selected', function() {
      $scope.items.forEach(function(method) {
        method.selected = false;
      });
    });

    $scope.getSublist = function(method) {
      $rootScope.$emit('get:source', methodGroup.owner, method);
    };

    $scope.select = function(method) {
      $rootScope.$emit('list-box:method:selected');
      method.selected = true;
    };
  };

  global.app.controller('MethodController', [
    '$scope',
    '$rootScope',
    'emitter',
    'MethodGroup',
    'Method',
    controller]);
})(window.global);
