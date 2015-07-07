(function(global, angular) {
  'use strict';

  var controller = function($scope, $rootScope, $element, $sce, $compile, source, marked) {
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

    $scope.$on('show:source', function(_event, gemspec) {
      var desc = gemspec.description;

      $scope.runtime_deps = gemspec.runtime_deps;
      $scope.development_deps = gemspec.development_deps;

      var depsElem = $compile('<gem-dependency>')($scope);

      $scope.source = $sce.trustAsHtml(marked(desc));
      $scope.$apply();

      $element[0].querySelector('.ng-binding').appendChild(depsElem[0]);
    });

    $scope.selectGem = function(dep) {
      $rootScope.$broadcast('select-gem-from-source', dep.split(' ')[0]);
    };
  };

  global.app.controller('SourceController', [
    '$scope',
    '$rootScope',
    '$element',
    '$sce',
    '$compile',
    'source',
    'marked',
    controller]);
})(window.global, window.angular);
