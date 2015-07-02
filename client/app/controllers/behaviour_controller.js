(function(global) {
  'use strict';

  var _ = require('underscore');

  var controller = function($scope, $sce, Behaviour) {
    $scope.items = [];

    $scope.$on('get:behaviour:all', function(_event1, gem) {
      var name = 'add:behaviour:' + gem.name;

      if (!$scope.$$listeners.hasOwnProperty(name)) {
        $scope.$on(name, function(_event2, behaviours) {
          $scope.$parent.$broadcast('reset-methods');
          $scope.$parent.$broadcast('reset-source');

          if (behaviours.length === 0) {
            $scope.$apply(function() {
              $scope.items = [{name: 'No behaviours found'}];
            });
          } else {
            $scope.$apply(function() {
              var sortedBehaviours = _.sortBy(behaviours, 'name').map(function(behaviour) {
                behaviour.selected = false;
                return behaviour;
              });

              var behaviourTree = sortedBehaviours.map(function(behaviour) {
                if (behaviour.name) {
                  // A feeble attempt at supporting behaviours
                  // with redefined #name
                  if (/^[^A-Z]/.test(behaviour.name)) {
                    behaviour.displayName = behaviour.name;
                    return behaviour;
                  }

                  var nestedClasses = behaviour.name.split('::'),
                      nestedClassesCount = nestedClasses.length,
                      className = nestedClasses[nestedClassesCount - 1],
                      indent = new Array(nestedClassesCount).join(' &bull; ');

                  behaviour.indent = $sce.trustAsHtml(indent);
                  behaviour.displayName = className;
                }
                return behaviour;
              });

              $scope.items = behaviourTree;
            });
          }
        });
      }

      Behaviour.getAllFrom(gem.name);
    });

    $scope.$on('list-box:behaviour:selected', function() {
      $scope.items.forEach(function(behaviour) {
        behaviour.selected = false;
      });
    });

    $scope.getSublist = function(behaviour) {
      $scope.$parent.$broadcast('get:method:all', behaviour);
    };

    $scope.select = function($event, behaviour) {
      $scope.$emit('list-box:behaviour:selected');
      behaviour.selected = true;

      $scope.items.forEach(function(behaviour) {
        $scope.hideIndent(behaviour);
      });

      $scope.showIndent(behaviour);
    };

    $scope.showIndent = function(behaviour) {
      behaviour.visibleIndent = true;
    };

    $scope.hideIndent = function(behaviour) {
      if (behaviour.selected) {
        return;
      }
      behaviour.visibleIndent = false;
    };
  };

  global.app.controller('BehaviourController', [
    '$scope',
    '$sce',
    'Behaviour',
    controller]);
})(window.global);
