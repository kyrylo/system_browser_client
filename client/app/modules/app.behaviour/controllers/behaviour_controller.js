(function(global, angular) {
  'use strict';

  var controller = function($scope, $rootScope, $sce, $timeout, behaviourService,
                            gemService, Behaviour, _) {
    // --- Public variables ----------------------------------------------------

    $scope.behaviours = [];

    // --- Private variables ---------------------------------------------------

    var noBehavioursMsg = 'No behaviours found';

    // --- Private methods -----------------------------------------------------

    var resetMethodState = function() {
      $rootScope.$broadcast('reset-methods');
      $rootScope.$broadcast('reset-source');
    };

    var emptyBehaviour = function() {
      return [{displayName: noBehavioursMsg, noop: true}];
    };

    var scrollTo = function(behaviour) {
      var container = angular.element(document.getElementById('behaviour-container'));
      var li = angular.element(document.getElementById(behaviour.name));

      if (li.length === 0) {
        return;
      } else {
        container.scrollTo(li, 50, 300);
      }
    };

    var selectBehaviour = function(behaviour) {
      scrollTo(behaviour);
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

    var findBehaviourByName = function(behaviourName) {
      var behaviour = _.find($scope.behaviours, function(behaviour) {
        if (behaviour.name === behaviourName) {
          return behaviour;
        } else {
          return false;
        }
      });

      return behaviour;
    };

    // --- Watchers ------------------------------------------------------------

    $scope.$watch("behaviours", function (behs) {
      if (behs && behs.length !== 0) {
        var selected = _.find(behs, function(behaviour) {
          return behaviour.selected;
        });

        if (selected) {
          $timeout(function() {
            scrollTo(selected);
          });
        }
      }
    });

    // --- Events --------------------------------------------------------------

    $scope.$on('get:behaviour:all', function(_e, gem, selectGemDeferred) {
      behaviourService.getAllFrom(gem.name).then(function(behaviours) {
        resetMethodState();

        if (behaviours.length === 0) {
          behaviours = emptyBehaviour();
        } else {
          behaviours = _.sortBy(behaviours, 'name').map(function(rawB) {
            var behaviour = new Behaviour(rawB);
            behaviour.indent($sce);

            return behaviour;
          });
        }

        $scope.behaviours = behaviours;
        selectGemDeferred.resolve();
      });
    });

    $scope.$on('list-box:behaviour:selected', function() {
      $scope.behaviours.forEach(deselectBehaviour);
    });

    $scope.$on('reset-behaviour', function() {
      $scope.behaviours = [];
      $rootScope.$broadcast('reset-source');
    });

    // --- Public methods ------------------------------------------------------

    $scope.showGroups = function(behaviour) {
      $rootScope.$broadcast('get:method:all', behaviour);
    };

    $scope.selectBehaviour = function($event, behaviour) {
      if (behaviour.noop) {
        return;
      }

      $scope.$emit('list-box:behaviour:selected');
      selectBehaviour(behaviour);

      $scope.behaviours.forEach(hideIndentation);
      showIndentation(behaviour);
    };

    $scope.openSuperclass = function($event, superclass) {
      $event.stopPropagation();

      gemService.getSelectedGem().then(function(gem) {
        behaviourService.openClass(superclass, gem).then(function(selectables) {
          gemService.selectGem(selectables.gem).then(function() {
            var behaviour = findBehaviourByName(selectables.behaviour);

            $scope.showGroups(behaviour);
            selectBehaviour(behaviour);
          });
        });
      });
    };

    $scope.showIndentation = showIndentation;

    $scope.hideIndentation = hideIndentation;
  };

  global.app.behaviour.controller('BehaviourController', [
    '$scope',
    '$rootScope',
    '$sce',
    '$timeout',
    'behaviourService',
    'gemService',
    'Behaviour',
    '_',
    controller
  ]);
})(window.global, window.angular);
