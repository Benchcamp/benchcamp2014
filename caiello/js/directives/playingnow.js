'use strict';


//hw directive
directives.directive('playingNow', function() {
  return {
    restrict: 'AEC',
    scope: {
    	ngTrack: '=',
    	ahora: '='
    },
    replace: 'true',
    templateUrl: 'views/directives/playing-now.html',
    controller: ['$scope', '$http', 'LYRICSAPI', function($scope, $http, LYRICSAPI) {

    	$scope.getLyrics = function(track) {

			$http.get(LYRICSAPI+track.song+" "+track.artist).
			then( function (res){
				$scope.track= track.song;
				$scope.artist= track.artist;
				$scope.lyrics = res.data[0].snippet;
			});

    	}
    }],
    link: function(scope, iElement, iAttrs, ctrl) {
    	//watching for changes..
    	scope.track="nothing..."
    	scope.artist="no one"

		scope.$on('playingsomething', function(event, track) {
			console.log(track);
			scope.getLyrics(track);
		});

    }

  };
});

