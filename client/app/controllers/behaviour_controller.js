(function(global) {
  'use strict';

  var _ = require('underscore');

  var controller = function($scope, $rootScope, Behaviour) {
    $scope.items = [];

    $scope.$on('get:behaviour:all', function(_event1, gem) {
      var name = 'add:behaviour:' + gem.name;

      if (!$scope.$$listeners.hasOwnProperty(name)) {
        $scope.$on(name, function(_event2, behaviours) {
          $rootScope.$emit('reset-methods');
          $rootScope.$emit('reset-source');

          if (behaviours.length === 0) {
            $scope.$apply(function() {
              $scope.items = [{name: 'No behaviours found'}];
            });
          } else {
            $scope.$apply(function() {
              $scope.items = _.sortBy(behaviours, 'name').map(function(behaviour) {
                behaviour.selected = false;
                return behaviour;
              });
            });
          }
        });
      }

      Behaviour.getAllFrom(gem.name);
    });

    $rootScope.$on('list-box:behaviour:selected', function() {
      $scope.items.forEach(function(behaviour) {
        behaviour.selected = false;
      });
    });

    $scope.getSublist = function(behaviour) {
      $scope.$parent.$broadcast('get:method:all', behaviour);
    };

    $scope.select = function(behaviour) {
      $rootScope.$emit('list-box:behaviour:selected');
      behaviour.selected = true;
    };
  };

  global.app.controller('BehaviourController', [
    '$scope',
    '$rootScope',
    'Behaviour',
    controller]);
})(window.global);
