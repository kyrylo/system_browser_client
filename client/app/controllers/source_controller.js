(function(global) {
  'use strict';

  var controller = function($scope, $rootScope, emitter, Source) {
    $rootScope.$on('get:source', function(_event, owner, method) {
      emitter.once('add:source:with-comment', function(source) {
        $scope.$apply(function() {
          $scope.source = source;
        });
      });

      Source.getSource(owner, method);
    });

    $rootScope.$on('reset-source', function() {
      $scope.source = null;
    });
  };

  global.app.controller('SourceController', [
    '$scope',
    '$rootScope',
    'emitter',
    'Source',
    controller]);
})(window.global);
