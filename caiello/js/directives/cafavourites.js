'use strict';

//modal directive
directives.directive("caFavourites", function() {
    return {
        restrict: "AE",
        // scope: {
        //   s: '='
        // },
        transclude: true,
        templateUrl: 'views/directives/cafavourites.html',
        link: function(scope, element, attrs) {
  
            // scope.f = function() {
            // }
            
        },
    }
})
