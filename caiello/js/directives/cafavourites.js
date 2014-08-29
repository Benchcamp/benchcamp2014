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
        controller: function($scope, $element){
           
            $scope.favs=[];

            $scope.addToFavourites = function(thingToAdd) {
                
                // don't insert repeated items
                if ($scope.favs.indexOf(thingToAdd) == -1)
                    $scope.favs.push(thingToAdd);
            };


        },
        link: function(scope, iElement, iAttrs, ctrl) {

        scope.$on('favourites', function(event, thing) {
            
            scope.addToFavourites(thing);
            //scope.getLyrics(track);
        });



    }
    }
})
