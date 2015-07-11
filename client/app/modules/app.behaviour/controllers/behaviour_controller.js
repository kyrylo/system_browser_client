(function(global, angular) {
  'use strict';

  var controller = function($scope, $rootScope, $sce, $timeout, behaviourService,
                            GemService, Behaviour, _) {
    // --- Public variables ----------------------------------------------------

    $scope.behaviours = [];

    // --- Private variables ---------------------------------------------------

    var noBehavioursMsg = 'No behaviours found';

    var behaviourToSelect;

    // --- Private methods -----------------------------------------------------

    var resetMethodState = function() {
      $rootScope.$broadcast('reset-methods');
      $rootScope.$broadcast('reset-source');
    };

    var emptyBehaviour = function() {
      return [{displayName: noBehavioursMsg}];
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

    var autoSelectBehaviour = function(behaviourName) {
      var behaviour = $scope.behaviours.filter(function(behaviour) {
        if (behaviour.name === behaviourName) {
          return behaviour;
        } else {
          return false;
        }
      });

      $scope.showGroups(behaviour[0]);
      $scope.selectBehaviour({}, behaviour[0]);
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

    $scope.$on('get:behaviour:all', function(_e, gem) {
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
      });
    });

    $scope.$on('list-box:behaviour:selected', function() {
      $scope.behaviours.forEach(deselectBehaviour);
    });

    $scope.$on('reset-behaviour', function() {
      $scope.behaviours = [];
    });

    // --- Public methods ------------------------------------------------------

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

    $scope.openSuperclass = function($event, superclass) {
      $event.stopPropagation();

      behaviourService.openClass(superclass).then(function(selectables) {
        GemService.selectGem(selectables.gem).then(function() {
          $timeout(function() {
            var behaviour = findBehaviourByName(selectables.behaviour);

            $scope.showGroups(behaviour);
            $scope.selectBehaviour({}, behaviour);
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
    'GemService',
    'Behaviour',
    '_',
    controller
  ]);
})(window.global, window.angular);
