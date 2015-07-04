(function(global) {
  'use strict';

  var controller = function($scope, Gem, _) {
    $scope.$on('get:gem:all', function() {
      Gem.getAll();
    });

    $scope.$on('add:gem:all', function(_event, gems) {
      var ruby_gems = gems.slice(2, gems.length).map(function(gem) {
        gem.icon = 'ruby';
        return gem;
      });

      var core_gems = gems.slice(0, 2).map(function(gem) {
        gem.icon = 'package';
        gem.selected = false;
        return gem;
      });

      $scope.items = core_gems.concat(_.sortBy(ruby_gems, 'name'));
    });

    $scope.$on('list-box:gem:selected', function() {
      $scope.items.forEach(function(gem) {
        gem.selected = false;
      });
    });

    $scope.getSublist = function(gem) {
      $scope.$parent.$broadcast('get:behaviour:all', gem);
    };

    $scope.select = function(gem) {
      $scope.$emit('list-box:gem:selected');
      gem.selected = true;
    };

    $scope.openGem = function(gem) {
      Gem.open(gem.name);
    };
  };

  global.app.controller('GemController', [
    '$scope',
    'Gem',
    '_',
    controller]);
})(window.global);
