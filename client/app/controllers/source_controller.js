(function(global) {
  'use strict';

  var controller = function($scope, $element, $sce, source) {
    $scope.$on('get:source', function(_event, owner, method) {
      source.extract(owner, method);
    });

    $scope.$on('add:source:with-comment', function(_event, source) {
      $scope.$apply(function() {
        $scope.source = $sce.trustAsHtml(source);
      });
    });

    $scope.$on('reset-source', function() {
      $scope.source = null;
    });
  };

  global.app.controller('SourceController', [
    '$scope',
    '$element',
    '$sce',
    'source',
    controller]);
})(window.global);
