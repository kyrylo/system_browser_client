(function(global) {
  'use strict';

  var directive = function() {
    return {
      restrict: 'E',

      templateUrl: 'partials/_gem_dependency_directive.html'
    };
  };

  global.app.directive('gemDependency', [directive]);
})(window.global);
