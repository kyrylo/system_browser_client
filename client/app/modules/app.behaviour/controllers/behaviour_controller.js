(function(global) {
  'use strict';

  var controller = function($scope, $rootScope, $sce, Behaviour, _) {
    // --------------------------- Public variables ----------------------------
    $scope.behaviours = [];

    // --------------------------- Events --------------------------------------

    $scope.$on('get:behaviour:all', function(_e, gem) {
      var event = 'add:behaviour:' + gem.name;

      if (!$scope.$$listeners.hasOwnProperty(event)) {
        listenTo(event);
      }

      Behaviour.getAllFrom(gem.name);
    });

    $scope.$on('list-box:behaviour:selected', function() {
      $scope.behaviours.forEach(deselectBehaviour);
    });

    // --------------------------- Private methods -----------------------------

    var resetMethodState = function() {
      $rootScope.$broadcast('reset-methods');
      $rootScope.$broadcast('reset-source');
    };

    var callbackForGem = function(_event2, behaviours) {
      resetMethodState();

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
    };

    var listenTo = function(event) {
      $scope.$on(event, callbackForGem);
    };

    var selectBehaviour = function(behaviour) {
      behaviour.selected = true;
    };

    var deselectBehaviour = function(behaviour) {
      behaviour.selected = false;
    };

    var hideIndentation = function(behaviour) {
      if (behaviour.selected) {
        return;
      }

      behaviour.visibleIndentation = false;
    };

    var showIndentation = function(behaviour) {
      behaviour.visibleIndentation = true;
    };

    // --------------------------- Public methods ------------------------------

    $scope.showGroups = function(behaviour) {
      $rootScope.$broadcast('get:method:all', behaviour);
      $rootScope.$broadcast('show:groupbar');
    };

    $scope.selectBehaviour = function($event, behaviour) {
      $scope.$emit('list-box:behaviour:selected');
      selectBehaviour(behaviour);

      $scope.behaviours.forEach(hideIndentation);
      showIndentation(behaviour);
    };

    $scope.showIndentation = showIndentation;

    $scope.hideIndentation = hideIndentation;
  };

  global.app.controller('BehaviourController', [
    '$scope',
    '$rootScope',
    '$sce',
    'Behaviour',
    '_',
    controller]);
})(window.global);
