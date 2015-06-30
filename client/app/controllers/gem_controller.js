(function(global) {
  'use strict';

  var _ = require('underscore');

  var controller = function($scope, $rootScope, Gem) {
    $scope.$on('get:gem:all', function() {
      Gem.getAll();
    });

    $scope.$on('add:gem:all', function(_event, gems) {
      var ruby_gems = gems.slice(2, gems.length);
      var core_gems = gems.slice(0, 2).map(function(gem) {
        gem.selected = false;
        return gem;
      });

      $scope.items = core_gems.concat(_.sortBy(ruby_gems, 'name'));
    });

    $rootScope.$on('list-box:gem:selected', function() {
      $scope.items.forEach(function(gem) {
        gem.selected = false;
      });
    });

    $scope.getSublist = function(gem) {
      $scope.$parent.$broadcast('get:behaviour:all', gem);
    };

    $scope.select = function(gem) {
      $rootScope.$emit('list-box:gem:selected');
      gem.selected = true;
    };
  };

  global.app.controller('GemController', [
    '$scope',
    '$rootScope',
    'Gem',
    controller]);
})(window.global);
