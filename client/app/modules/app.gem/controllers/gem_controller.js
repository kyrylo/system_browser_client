(function(global, angular) {
  'use strict';

  var controller = function($scope, $rootScope, $timeout, GemService, _) {
    // --- Public variables ----------------------------------------------------

    $scope.gems = [];

    $scope.searchText = '';

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
      GemService.getDescription(gemName).then(function(gemspec) {
        $timeout(function() {
          $rootScope.$broadcast('show:source', gemspec);
        });
      });
    };

    var findGemByName = function(gemName) {
      var gem = _.find($scope.gems, function(gem) {
        if (gem.name === gemName) {
          return gem;
        } else {
          return false;
        }
      });

      return gem;
    };

    // --- Events --------------------------------------------------------------

    $scope.$on('get:gem:all', function() {
      GemService.getAll().then(function(gems) {
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
    });

    $scope.$on('select-gem', function(_event, deferred, gemName) {
      var gem = findGemByName(gemName);

      if (gem) {
        $scope.selectGem(gem, deferred);
        deferred.resolve();
      } else {
        throw new Error('gem not found: ' + gemName);
      }
    });

    $scope.$on('search-change', function(_event, val) {
      $scope.searchText = val;
    });

    // --- Public methods ------------------------------------------------------

    $scope.showBehaviours = function(gem) {
      $rootScope.$broadcast('get:behaviour:all', gem);
    };

    $scope.selectGem = function(gem) {
      $rootScope.$broadcast('reset-behaviour');

      $scope.showBehaviours(gem);
      getDescription(gem.name);

      $scope.gems.forEach(deselectGem);
      selectGem(gem);
    };

    $scope.openGem = function(gem) {
      GemService.open(gem.name);
    };
  };

  global.app.gem.controller('GemController', [
    '$scope',
    '$rootScope',
    '$timeout',
    'GemService',
    '_',
    controller
  ]);
})(window.global, window.angular);
