(function(global) {
  'use strict';

  var controller = function($scope, $element, group, groupBar) {
    // --- Public variables ----------------------------------------------------

    $scope.groups = [];

    // --- Private methods -----------------------------------------------------

    var showGroupBar = function() {
      $scope.showGroupBar = true;
    };

    // --- Events --------------------------------------------------------------

    $scope.$on('add:method-group', function(_event, methodGroup) {
      var ctx;

      if (groupBar.isClassSide()) {
        ctx = 'singleton';
      } else {
        ctx = 'instance';
      }

      if (methodGroup.anyPublicMethods(ctx)) {
        $scope.groups.push({name: group.labels.public});
      }

      if (methodGroup.anyPrivateMethods(ctx)) {
        $scope.groups.push({name: group.labels.private});
      }

      if (methodGroup.anyProtectedMethods(ctx)) {
        $scope.groups.push({name: group.labels.protected});
      }

      if ($scope.groups.length > 0) {
        $scope.groups.unshift({name: group.labels.all, selected: true});
      }
    });

    $scope.$on('reset-methods', function() {
      $scope.items = [];
      $scope.showGroupBar = false;
      if ($scope.groupbar) {
        $scope.groupbar.classSide = false;
      }
    });

    $scope.$on('list-box:group:selected', function() {
      $scope.items.forEach(function(group) {
        group.selected = false;
      });
      showGroupBar();
    });

    $scope.$on('show:groupbar', function() {
      showGroupBar();
    });

    $scope.$on('method-count:method', function(_event, count) {
      $scope.classMethodCount = count.classMethods;
      $scope.instanceMethodCount = count.instanceMethods;
    });

    // --- Public methods ------------------------------------------------------

    $scope.getSublist = function(group) {
      $scope.$parent.$broadcast('filter:method', group);
    };

    $scope.select = function(group) {
      $scope.$emit('list-box:group:selected');
      group.selected = true;
    };

    $scope.toggleClassSide = function() {
      $scope.$parent.$broadcast('class-side-checkbox', $scope.groupbar.classSide);
      showGroupBar();
    };

    $scope.isClassSide = function() {
      return groupBar.isClassSide();
    };

    $scope.shouldShowGroupBar = function() {
      if (!$scope.items) {
        return false;
      }

      return $scope.showGroupBar || $scope.items.length > 0;
    };
  };

  global.app.group.controller('GroupController', [
    '$scope',
    '$element',
    'group',
    'groupBar',
    controller]);
})(window.global);
