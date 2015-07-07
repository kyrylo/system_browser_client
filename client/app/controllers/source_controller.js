(function(global) {
  'use strict';

  var controller = function($scope, $element, $sce, source, marked) {
    var setSource = function(source) {
      $scope.$apply(function() {
        $scope.source = $sce.trustAsHtml(source);
      });
    };

    $scope.$on('get:source', function(_event, owner, method) {
      source.extract(owner, method);
    });

    $scope.$on('add:source:with-comment', function(_event, source) {
      setSource(source);
    });

    $scope.$on('reset-source', function() {
      $scope.source = null;
    });

    $scope.$on('show:source', function(_event, description) {
      setSource(marked(description));
    });
  };

  global.app.controller('SourceController', [
    '$scope',
    '$element',
    '$sce',
    'source',
    'marked',
    controller]);
})(window.global);
