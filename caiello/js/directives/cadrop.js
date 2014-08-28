'use strict';

//modal directive
directives.directive("caDropzone", function() {
    return {
        restrict: "AE",
        // scope: {
        //   xaxis: '='
        // },
        transclude: true,
        templateUrl: 'views/directives/cadrop.html',
        link: function(scope, element, attrs) {

            
        },
    }
})
