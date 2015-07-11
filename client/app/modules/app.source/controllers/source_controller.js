(function(global) {
  'use strict';

  var controller = function($scope, $element, $sce, $compile, $timeout,
                            sourceService, gemService, marked) {
    $scope.runtime_deps = [];
    $scope.development_deps = [];

    $scope.$on('get:source', function(_event, owner, method) {
      sourceService.extract(owner, method).then(function(source) {
        $timeout(function() {
          $scope.$apply(function() {
            $scope.source = $sce.trustAsHtml(source);
          });
        });
      });
    });

    $scope.$on('reset-source', function() {
      $scope.source = null;
    });

    $scope.$on('show-gem-deps', function(_event, gemspec) {
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

  global.app.source.controller('SourceController', [
    '$scope',
    '$element',
    '$sce',
    '$compile',
    '$timeout',
    'sourceService',
    'gemService',
    'marked',
    controller]);
})(window.global);
