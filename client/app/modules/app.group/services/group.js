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

  global.app.group.service('group', [Group]);
})(window.global);
