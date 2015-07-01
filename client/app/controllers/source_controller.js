(function(global) {
  'use strict';

  var hljs = require('highlight.js');

  var controller = function($scope, $element, $sce, Source) {
    $scope.$on('get:source', function(_event, owner, method) {
      Source.extract(owner, method);
    });

    $scope.$on('add:source:with-comment', function(_event, source) {
      $scope.$apply(function() {
        $scope.source = $sce.trustAsHtml(hljs.highlight('ruby', source).value);
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
    'Source',
    controller]);
})(window.global);
