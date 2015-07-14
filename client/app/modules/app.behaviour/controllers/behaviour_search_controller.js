(function(global) {
  'use strict';

  var controller = function($scope) {
    // --- Private methods -----------------------------------------------------

    var resetSearchInput;
    (resetSearchInput = function() {
      $scope.search = {
        searchText: '',
        hoverX: false
      };
    }).call();

    // --- Watchers ------------------------------------------------------------

    $scope.$watch('search.searchText', function(newVal) {
      $scope.$emit('search-change', newVal);
    });

    // --- Public methods ------------------------------------------------------

    $scope.searching = function() {
      return $scope.search.searchText.length > 0;
    };

    $scope.onMouseMove = function($event) {
      if (!$scope.searching()) {
        return;
      }

      var el = $event.toElement,
          inputWidth = el.offsetWidth - 18,
          searchBarWidth = el.getBoundingClientRect().left;

      $scope.search.hoverX = inputWidth < $event.clientX - searchBarWidth;
    };

    $scope.clearSearch = function($event) {
      if (!$scope.search.hoverX) {
        return;
      }

      $event.preventDefault();
      resetSearchInput();
    };
  };

  global.app.behaviour.controller('BehaviourSearchController', [
    '$scope',
    controller
  ]);
})(window.global);
