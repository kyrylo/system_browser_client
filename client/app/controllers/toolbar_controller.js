(function(global) {
  'use strict';

  var controller = function($scope, $rootScope) {
    $scope.toggleClassSide = function() {
      $rootScope.$broadcast('class-side-checkbox', $scope.toolbar.classSide);
    };
  };

  global.app.controller('ToolbarController', [
    '$scope',
    '$rootScope',
    controller]);
})(window.global);
