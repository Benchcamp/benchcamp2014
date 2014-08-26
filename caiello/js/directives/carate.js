'use strict';

//modal directive
directives.directive("caRate", function() {
    return {
        restrict: "E",
        transclude: true,
        templateUrl: 'views/directives/carate.html'
    }
})
