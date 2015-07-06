(function(global) {
  'use strict';

  var controller = function($scope, $rootScope, groupBar) {
    // --- Events --------------------------------------------------------------

    $scope.$on('method-count:method', function(_event, count) {
      $scope.classMethods = count.classMethods;
      $scope.instanceMethods = count.instanceMethods;
    });

    $scope.$on('reset-groupbar', function() {
      groupBar.hide();
      groupBar.setInstanceSide();
    });

    $rootScope.$on('group_bar:show', function() {
      groupBar.show();
    });

    // --- Watches -------------------------------------------------------------

    $scope.$watch('classSide', function(newVal, oldVal) {
      if (newVal === oldVal) {
        return;
      }

      groupBar.classSide = newVal;
      $rootScope.$broadcast('update-method-side');
    });

    // --- Public methods ------------------------------------------------------

    $scope.isVisible = function() {
      return groupBar.visible;
    };

    $scope.isClassSide = function() {
      return groupBar.classSide;
    };
  };

  global.app.group.controller('GroupBarController', [
    '$scope',
    '$rootScope',
    'groupBar',
    controller]);
})(window.global);
