(function(global) {
  'use strict';

  var controller = function($scope, $rootScope, $sce, Behaviour, _) {
    $scope.behaviours = [];

    $scope.$on('get:behaviour:all', function(_event1, gem) {
      var name = 'add:behaviour:' + gem.name;

      if (!$scope.$$listeners.hasOwnProperty(name)) {
        $scope.$on(name, function(_event2, behaviours) {
          $scope.$parent.$broadcast('reset-methods');
          $scope.$parent.$broadcast('reset-source');

          if (behaviours.length === 0) {
            $scope.$apply(function() {
              $scope.behaviours = [{displayName: 'No behaviours found'}];
            });
          } else {
            $scope.$apply(function() {
              var sortedBehaviours = _.sortBy(behaviours, 'name').map(function(behaviour) {
                behaviour.selected = false;
                return behaviour;
              });

              var behaviourTree = sortedBehaviours.map(function(behaviour) {
                if (behaviour.isModule) {
                  behaviour.icon = 'module';
                } else if (behaviour.isException) {
                  behaviour.icon = 'exception';
                } else {
                  behaviour.icon = 'class';
                }

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

                  behaviour.indentation = $sce.trustAsHtml(indent);
                  behaviour.displayName = className;
                }
                return behaviour;
              });

              $scope.behaviours = behaviourTree;
            });
          }
        });
      }

      Behaviour.getAllFrom(gem.name);
    });

    $scope.$on('list-box:behaviour:selected', function() {
      $scope.behaviours.forEach(function(behaviour) {
        behaviour.selected = false;
      });
    });

    $scope.showGroups = function(behaviour) {
      $rootScope.$broadcast('get:method:all', behaviour);
      $rootScope.$broadcast('show:groupbar');
    };

    $scope.selectBehaviour = function($event, behaviour) {
      $scope.$emit('list-box:behaviour:selected');
      behaviour.selected = true;

      $scope.behaviours.forEach(function(behaviour) {
        $scope.hideIndentation(behaviour);
      });

      $scope.showIndentation(behaviour);
    };

    $scope.showIndentation = function(behaviour) {
      behaviour.visibleIndentation = true;
    };

    $scope.hideIndentation = function(behaviour) {
      if (behaviour.selected) {
        return;
      }

      behaviour.visibleIndentation = false;
    };
  };

  global.app.controller('BehaviourController', [
    '$scope',
    '$rootScope',
    '$sce',
    'Behaviour',
    '_',
    controller]);
})(window.global);
