(function(global) {
  'use strict';

  var controller = function($scope, $rootScope, GemService, _) {
    // --- Public variables ----------------------------------------------------

    $scope.gems = [];

    $scope.search = { searchText: '' };

    // --- Private methods -----------------------------------------------------

    var selectGem = function(gem) {
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

    // --- Public methods ------------------------------------------------------

    $scope.showBehaviours = function(gem) {
      $rootScope.$broadcast('get:behaviour:all', gem);
    };

    $scope.selectGem = function(gem) {
      $scope.$emit('list-box:gem:selected');

      getDescription(gem.name);

      selectGem(gem);
    };

    $scope.openGem = function(gem) {
      GemService.open(gem.name);
    };
  };

  global.app.gem.controller('GemController', [
    '$scope',
    '$rootScope',
    'GemService',
    '_',
    controller]);
})(window.global);
