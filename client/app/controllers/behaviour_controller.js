(function(global) {
  'use strict';

  var _ = require('underscore');

  var controller = function($scope, $rootScope, emitter, Behaviour) {
    $scope.items = [];

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
            $scope.items = _.sortBy(behaviours, 'name').map(function(behaviour) {
              behaviour.selected = false;
              return behaviour;
            });
          });
        }
      });

      Behaviour.getAllFrom(gem.name);
    });

    $rootScope.$on('list-box:behaviour:selected', function() {
      $scope.items.forEach(function(behaviour) {
        behaviour.selected = false;
      });
    });

    $scope.getSublist = function(behaviour) {
      emitter.emit('get:method:all', behaviour);
    };

    $scope.select = function(behaviour) {
      $rootScope.$emit('list-box:behaviour:selected');
      behaviour.selected = true;
    };
  };

  global.app.controller('BehaviourController', [
    '$scope',
    '$rootScope',
    'emitter',
    'Behaviour',
    controller]);
})(window.global);
