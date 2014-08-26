'use strict';

//modal directive
directives.directive("caModal", function() {
    return {
        restrict: "E",
        scope: {
          ngShow: '='
        },
        transclude: true,
        templateUrl: 'views/directives/camodal.html',
        link: function(scope, element, attrs) {
            scope.hideModal = function() {
                scope.ngShow = false;
            }
            
        },
    }
})
