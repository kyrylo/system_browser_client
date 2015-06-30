(function(global) {
  'use strict';

  var controller = function($scope, Source) {
    $scope.$on('get:source', function(_event, owner, method) {
      Source.getSource(owner, method);
    });

    $scope.$on('add:source:with-comment', function(_event, source) {
      $scope.$apply(function() {
        $scope.source = source;
      });
    });

    $scope.$on('reset-source', function() {
      $scope.source = null;
    });
  };

  global.app.controller('SourceController', [
    '$scope',
    'Source',
    controller]);
})(window.global);
