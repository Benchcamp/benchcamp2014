'use strict';

//modal directive
directives.directive("caDropzone", function() {
    return {
        restrict: "AE",
        transclude: true,
        templateUrl: 'views/directives/cadrop.html',
        link: function(scope, element, attrs) {
            //console.log(attrs.dzname);

        },
    }
})
