(function(global) {
  'use strict';

  var controller = function($scope, $rootScope, Source) {
    $rootScope.$on('get:source', function(_event, owner, method) {
      Source.getSource(owner, method);
    });

    $scope.$on('add:source:with-comment', function(_event, source) {
      $scope.$apply(function() {
        $scope.source = source;
      });
    });

    $rootScope.$on('reset-source', function() {
      $scope.source = null;
    });
  };

  global.app.controller('SourceController', [
    '$scope',
    '$rootScope',
    'Source',
    controller]);
})(window.global);
