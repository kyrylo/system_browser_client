(function (angular, describe, it, expect, beforeEach, inject, module) {
	'use strict';

  angular.module('app', ['ngMock']);

  describe('GemController', function() {
    beforeEach(function() {
      module('underscore');
      module('app.gem');
    });

    var $controller, $scope,
        socketMock, RequestMock, GemServiceMock;

    beforeEach(module(function($provide) {
      socketMock = {};
      RequestMock = {};

      GemServiceMock = {getAll: ['gem1', 'gem2', 'gem3']};

      $provide.value('socket', socketMock);
      $provide.value('Request', RequestMock);
      $provide.value('GemService', GemServiceMock);
    }));

    beforeEach(inject(function(_$controller_, $rootScope) {
      $controller = _$controller_;
      $scope = $rootScope.$new();
    }));

    describe("methods", function() {

      describe("$scope.showBehaviours", function() {

        it("retrieves all gems", function() {
          $controller('GemController', {
            $scope: $scope, _: window.global.underscore
          });

          expect($scope.gems.length).toEqual(0);

          $scope.showBehaviours();

          expect($scope.gems.length).not.toEqual(3);
        });

      });

    });

  });
}(window.angular, window.describe, window.it, window.expect, window.beforeEach,
  window.inject, window.module));
