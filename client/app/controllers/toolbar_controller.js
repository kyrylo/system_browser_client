(function(global) {
  'use strict';

  var controller = function($scope, $rootScope, Toolbar) {
    $scope.toggleClassSide = function() {
      $rootScope.$broadcast('class-side-checkbox', $scope.toolbar.classSide);
    };

    $scope.classSideChecked = function() {
      return Toolbar.classSideChecked();
    };
  };

  global.app.controller('ToolbarController', [
    '$scope',
    '$rootScope',
    'Toolbar',
    controller]);
})(window.global);
