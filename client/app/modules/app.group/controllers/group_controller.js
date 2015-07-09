(function(global) {
  'use strict';

  var controller = function($scope, $rootScope, group, groupBar) {
    // --- Public variables ----------------------------------------------------

    $scope.groups = [];

    // --- Private methods -----------------------------------------------------

    var selectGroup = function(group) {
      group.selected = true;
    };

    var deselectGroup = function(group) {
      group.selected = false;
    };

    // --- Events --------------------------------------------------------------

    $scope.$on('add:method-group', function(_event, methodGroup) {
      var groups = [];
      var ctx;

      if (groupBar.classSide) {
        ctx = 'singleton';
      } else {
        ctx = 'instance';
      }

      if (methodGroup.anyPublicMethods(ctx)) {
        groups.push({name: group.labels.public});
      }

      if (methodGroup.anyPrivateMethods(ctx)) {
        groups.push({name: group.labels.private});
      }

      if (methodGroup.anyProtectedMethods(ctx)) {
        groups.push({name: group.labels.protected});
      }

      if (methodGroup.anyCMethods(ctx)) {
        groups.push({name: group.labels.cmethods, icon: 'c-group'});
      }

      if (methodGroup.anyRubyMethods(ctx)) {
        groups.push({name: group.labels.rbmethods, icon: 'ruby-group'});
      }

      if (groups.length > 0) {
        groups.unshift({name: group.labels.all, selected: true});
      }

      $rootScope.$emit('group_bar:show');

      $scope.groups = groups;
    });

    $scope.$on('reset-methods', function() {
      $scope.groups = [];
      $rootScope.$broadcast('reset-groupbar');
    });

    // --- Public methods ------------------------------------------------------

    $scope.filterMethodsBy = function(group) {
      $rootScope.$broadcast('filter:method', group);
    };

    $scope.selectGroup = function(group) {
      $scope.groups.forEach(deselectGroup);
      selectGroup(group);
    };
  };

  global.app.group.controller('GroupController', [
    '$scope',
    '$rootScope',
    'group',
    'groupBar',
    controller]);
})(window.global);
