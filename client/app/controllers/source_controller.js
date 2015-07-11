(function(global, angular) {
  'use strict';

  var controller = function($scope, $rootScope, $element, $sce, $compile,
                            source, gemService, marked) {
    $scope.runtime_deps = [];
    $scope.development_deps = [];

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
      $scope.runtime_deps = [];
      $scope.development_deps = [];

      var desc = gemspec.description;

      if (gemspec.runtime_deps) {
        $scope.runtime_deps = gemspec.runtime_deps.map(function(dep) {
          return {full_name: dep, name: dep.split(' ')[0]};
        });
      }

      if (gemspec.development_deps) {
        $scope.development_deps = gemspec.development_deps.map(function(dep) {
          return {full_name: dep, name: dep.split(' ')[0]};
        });
      }

      var depsElem = $compile('<gem-dependency>')($scope);

      $scope.source = $sce.trustAsHtml(marked(desc));
      $scope.$apply();

      $element[0].querySelector('.ng-binding').appendChild(depsElem[0]);
    });

    $scope.selectGem = function(dep) {
      $scope.runtime_deps = [];
      $scope.development_deps = [];

      gemService.selectGem(dep);
    };
  };

  global.app.controller('SourceController', [
    '$scope',
    '$rootScope',
    '$element',
    '$sce',
    '$compile',
    'source',
    'gemService',
    'marked',
    controller]);
})(window.global, window.angular);
