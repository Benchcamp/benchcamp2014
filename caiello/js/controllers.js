"use strict";

//Artist List Controller
controllers.controller('ArtistsListCtrl', function($scope, $http, SongsService){

	SongsService.load("artists").
	then( function (res){
		$scope.artists=res.data.artists;
	});
   
})

//Artist List
controllers.controller('AlbumsListCtrl', function($scope, $http, SongsService){

	SongsService.load("albums").
	then( function (res){
		$scope.albums=res.data.albums;
	});
})


//Tracks
controllers.controller('TracksListCtrl', function($scope, $http, SongsService){

	SongsService.load("tracks").
	then( function (res){
		$scope.tracks=res.data.tracks;
	});
})

controllers.controller('PlayerCtrl', function ($scope, SoundJS) {

    
	
	$scope.play = function(artist, album, track) {
    	SoundJS.play(artist, album, track);
	    console.log("playing: "+ artist +", "+album+", "+track);
	}
})


controllers.controller('SoundJSCtrl', function ($scope, SoundJS) {

    //SoundJS.registerTrack();
	
	
})
