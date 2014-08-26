'use strict';

//modal directive
directives.directive("draggable", function() {
    return {
        restrict: "AE",
        // scope: {
        //   xaxis: '='
        // },
        transclude: true,
        templateUrl: 'views/directives/cadrag.html',
        link: function(scope, element, attrs) {
            console.log(scope.xaxis);
            scope.isDragging = function() {
                console.log("yeah, "+scope.xaxis);
            }
            
        },
    }
})
