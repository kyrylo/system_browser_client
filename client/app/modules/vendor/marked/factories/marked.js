(function(global) {
  'use strict';

  var marked = require('marked');

  var factory = function() {
    marked.setOptions({
      renderer: new marked.Renderer(),
      gfm: true,
      tables: true
    });

    return marked;
  };

  global.marked.factory('marked', [factory]);
})(window.global);
