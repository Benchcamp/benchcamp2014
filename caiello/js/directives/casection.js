'use strict';


//section directive
directives.directive('caSection', function() {
  return {
    restrict: 'AE',
    replace: true,
    transclude: true,
    templateUrl: 'views/directives/casection.html'
  };
});

