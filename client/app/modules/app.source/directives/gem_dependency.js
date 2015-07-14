(function(global) {
  'use strict';

  var directive = function() {
    return {
      restrict: 'E',

      templateUrl: 'modules/app.source/partials/_gem_dependency_directive.html'
    };
  };

  global.app.source.directive('gemDependency', [directive]);
})(window.global);
