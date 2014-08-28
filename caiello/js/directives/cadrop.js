'use strict';

//modal directive
directives.directive("caDropzone", function() {
    return {
        restrict: "AE",
        transclude: true,
        templateUrl: 'views/directives/cadrop.html',
        scope:{
            dragging:"=",
            //dzname:"="
        },
        link: function(scope, element, attrs) {
            //scope.dzname=attrs.dzname;
        },
    }
})
