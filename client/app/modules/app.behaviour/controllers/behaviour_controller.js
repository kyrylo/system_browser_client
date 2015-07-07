(function(global) {
  'use strict';

  var controller = function($scope, $rootScope, $sce, behaviourService,
                            Behaviour, _) {
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
      return [{displayName: noBehavioursMsg}];
    };

    var callbackForGem = function(_event2, rawBehaviours) {
      var behaviours;

      resetMethodState();

      if (rawBehaviours.length === 0) {
        behaviours = emptyBehaviour();
      } else {
          behaviours = _.sortBy(rawBehaviours, 'name').map(function(rawB) {
            var behaviour = new Behaviour(rawB);
            behaviour.indent($sce);

            return behaviour;
          });
      }

      $scope.$apply(function() {
        $scope.behaviours = behaviours;
      });
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

    // --- Events --------------------------------------------------------------

    $scope.$on('get:behaviour:all', function(_e, gem) {
      var event = 'add:behaviour:' + gem.name;

      if (!$scope.$$listeners.hasOwnProperty(event)) {
        listenTo(event);
      }

      behaviourService.getAllFrom(gem.name);
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

    $scope.showIndentation = showIndentation;

    $scope.hideIndentation = hideIndentation;
  };

  global.app.behaviour.controller('BehaviourController', [
    '$scope',
    '$rootScope',
    '$sce',
    'behaviourService',
    'Behaviour',
    '_',
    controller]);
})(window.global);
