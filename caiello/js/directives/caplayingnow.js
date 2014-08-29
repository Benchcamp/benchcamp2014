'use strict';


//playing now directive
directives.directive('caPlayingNow', function() {
  return {
    restrict: 'AEC',
    replace: true,
    transclude: true,
    templateUrl: 'views/directives/caplayingnow.html',
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
			scope.getLyrics(track);
		});
    }

  };
});

