'use strict';

//modal directive
directives.directive("caRate", function() {
    return {
        restrict: "E",
        transclude: true,
        templateUrl: 'views/directives/carate.html',
        link:function(scope, elements, attrs){
        	scope.stars =[];

        	for (var i=0; i<5; i++){
                scope.stars.push(false);
        	}
        	
        	scope.selectRating = function(star){
        		//stub
            }

        }
    }
})
