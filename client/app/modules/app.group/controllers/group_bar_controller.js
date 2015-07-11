(function(global) {
  'use strict';

  var controller = function($scope, $rootScope, groupBar) {
    // --- Public variables ----------------------------------------------------

    $scope.isClassSide = groupBar.classSide;

    $scope.hasMethodlessSide = false;

    // --- Private methods -----------------------------------------------------

    var setSide = function() {
      $scope.isClassSide = groupBar.classSide;
    };

    // --- Events --------------------------------------------------------------

    $scope.$on('method-count:method', function(_event, count) {
      $scope.hasMethodlessSide =
        count.classMethods === 0 || count.instanceMethods === 0;
      $scope.classMethods = count.classMethods;
      $scope.instanceMethods = count.instanceMethods;
    });

    $scope.$on('reset-groupbar', function() {
      groupBar.reset();
      setSide();
    });

    $scope.$on('group_bar:show', function() {
      groupBar.show();
      setSide();
    });

    // --- Public methods ------------------------------------------------------

    $scope.isVisible = function() {
      return groupBar.visible;
    };

    $scope.toggleMethodSide = function() {
      groupBar.toggleSide();
      $rootScope.$broadcast('update-method-side');
    };
  };

  global.app.group.controller('GroupBarController', [
    '$scope',
    '$rootScope',
    'groupBar',
    controller
  ]);
})(window.global);
