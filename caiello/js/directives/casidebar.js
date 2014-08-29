'use strict';


//sidebar directive
directives.directive('caSidebar', function() {
  return {
    restrict: 'AE',
    replace: true,
    transclude: true,
    templateUrl: 'views/directives/casidebar.html'
  };
});

