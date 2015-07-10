(function(global, angular) {
  'use strict';

  var controller = function($scope, $rootScope, GemService, _) {
    // --- Public variables ----------------------------------------------------

    $scope.gems = [];

    $scope.search = { searchText: '' };

    $scope.isOnX = false;

    // --- Private methods -----------------------------------------------------

    var selectGem = function(gem) {
      var container = angular.element(document.getElementById('gem-container'));
      var li = angular.element(document.getElementById(gem.name));
      container.scrollTo(li, 50, 300);

      gem.selected = true;
    };

    var deselectGem = function(gem) {
      gem.selected = false;
    };

    var setIcon = function(gem, iconName) {
      gem.icon = iconName;
    };

    var getDescription = function(gemName) {
      var eventName = 'add:gem:' + gemName;

      $scope.$on(eventName, function(_event, description) {
        $scope.$$listeners[eventName] = [];
        $rootScope.$broadcast('show:source', description);
      });

      GemService.getDescription(gemName);
    };

    var resetBehaviourState = function() {
      $rootScope.$broadcast('reset-behaviour');
    };

    var autoSelectGem = function(gemName, behaviourToSelect) {
      var gem = $scope.gems.filter(function(gem) {
        if (gem.name === gemName) {
          return gem;
        } else {
          return false;
        }
      });

      $scope.showBehaviours(gem[0], behaviourToSelect);
      $scope.selectGem(gem[0]);
    };

    // --- Events --------------------------------------------------------------

    $scope.$on('get:gem:all', function() {
      GemService.getAll();
    });

    $scope.$on('add:gem:all', function(_event, gems) {
      var ruby_gems = gems.slice(2, gems.length).map(function(gem) {
        setIcon(gem, 'ruby');
        return gem;
      });

      var core_gems = gems.slice(0, 2).map(function(gem) {
        setIcon(gem, 'package');
        deselectGem(gem);
        return gem;
      });

      $scope.gems = core_gems.concat(_.sortBy(ruby_gems, 'name'));
    });

    $scope.$on('list-box:gem:selected', function() {
      $scope.gems.forEach(deselectGem);
    });

    $scope.$on('select-gem-from-source', function(_event, gemName) {
      autoSelectGem(gemName);
    });

    $scope.$on('autoadd:behaviour:', function(_event, selectables) {
      autoSelectGem(selectables.gem, selectables.behaviour);
    });

    // --- Public methods ------------------------------------------------------

    $scope.showBehaviours = function(gem, behaviourToSelect) {
      $rootScope.$broadcast('get:behaviour:all', gem, behaviourToSelect);
    };

    $scope.selectGem = function(gem) {
      resetBehaviourState();

      $scope.$emit('list-box:gem:selected');

      getDescription(gem.name);

      selectGem(gem);
    };

    $scope.openGem = function(gem) {
      GemService.open(gem.name);
    };

    $scope.searching = function() {
      return $scope.search.searchText.length > 0;
    };

    $scope.onMouseMove = function($event) {
      if (!$scope.searching()) {
        return;
      }

      var el = $event.toElement,
          inputWidth = el.offsetWidth-18,
          searchBarWidth = el.getBoundingClientRect().left;

      $scope.isOnX = inputWidth < $event.clientX - searchBarWidth;
    };

    $scope.clearSearch = function($event) {
      if (!$scope.isOnX) {
        return;
      }

      $event.preventDefault();
      $scope.search.searchText = '';
    };
  };

  global.app.gem.controller('GemController', [
    '$scope',
    '$rootScope',
    'GemService',
    '_',
    controller]);
})(window.global, window.angular);
