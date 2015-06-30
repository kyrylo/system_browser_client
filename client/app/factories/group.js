(function(global) {
  'use strict';

  var Group = function() {
    this.labels = {
      all: '-- all --',
      public: 'public',
      private: 'private',
      protected: 'protected'
    };
  };

  Group.prototype.constructor = Group;

  var factory = function() {
    return new Group();
  };

  global.app.factory('Group', [factory]);
})(window.global);
