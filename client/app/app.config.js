(function(global) {
  'use strict';

  global.app.config(['ScrollBarsProvider', function(ScrollBarsProvider) {
    ScrollBarsProvider.defaults = {
      scrollButtons: {
        scrollAmount: 'auto',
        enable: false
      },
      advanced: {
        autoExpandHorizontalScroll: true
      },
      axis: 'yx',
      scrollInertia: 150,
      autoHideScrollbar: true,
      theme: 'minimal-dark'
    };
  }]);
})(window.global);
