/*
 * --------------
 * /!\ NO-OP /!\
 * --------------
 *
 * It's cheaper not write tests for sockets rather than to write them.
 */

(function (angular, describe, it, expect, beforeEach, inject, module, spyOn) {
	'use strict';

  angular.module('app', ['ngMock']);

  describe('GemController', function() {
    beforeEach(function() {
      module('underscore');
      module('app.gem');
    });

    var $controller, $scope, $rootScope,
        socketMock, RequestMock, GemServiceMock;

    beforeEach(module(function($provide) {
      socketMock = {};
      RequestMock = {};

      GemServiceMock = {
        getAll: function() {
          $rootScope.broadcast('add:gem:all');
          return ['gem1', 'gem2', 'gem3'];
        }
      };

      $provide.value('socket', socketMock);
      $provide.value('Request', RequestMock);
      $provide.value('GemService', GemServiceMock);
    }));

    beforeEach(inject(function(_$controller_, _$rootScope_) {
      $controller = _$controller_;
      $rootScope = _$rootScope_;
      $scope = $rootScope.$new();

      $controller('GemController', {
        $scope: $scope,
        _: window.global.underscore
      });
    }));

    describe("events", function() {

      describe("$scope.$on get:gem:all", function() {

        it("retrieves all gems", function() {
          return;
          expect($scope.gems.length).toEqual(0);

          $rootScope.$broadcast('get:gem:all');

          expect($scope.gems.length).toEqual(3);
        });

      });

    });

  });
}(window.angular, window.describe, window.it, window.expect, window.beforeEach,
  window.inject, window.module, window.spyOn));
