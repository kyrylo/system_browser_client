(function(global) {
  'use strict';

  var controller = function($scope, $rootScope, groupBar) {
    // --- Public variables ----------------------------------------------------

    $scope.isClassSide = groupBar.classSide;

    // --- Events --------------------------------------------------------------

    $scope.$on('method-count:method', function(_event, count) {
      $scope.classMethods = count.classMethods;
      $scope.instanceMethods = count.instanceMethods;
    });

    $scope.$on('reset-groupbar', function() {
      groupBar.reset();
      $scope.isClassSide = groupBar.classSide;
    });

    $rootScope.$on('group_bar:show', function() {
      groupBar.show();
    });

    // --- Public methods ------------------------------------------------------

    $scope.isVisible = function() {
      return groupBar.visible;
    };

    $scope.toggleMethodSide = function() {
      groupBar.toggleSide();

      $scope.isClassSide = groupBar.classSide;

      $rootScope.$broadcast('update-method-side');
    };
  };

  global.app.group.controller('GroupBarController', [
    '$scope',
    '$rootScope',
    'groupBar',
    controller]);
})(window.global);
