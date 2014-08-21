"use strict";

//Artist List Controller
controllers.controller('ArtistsListCtrl', function($scope, $http, SoundService){

	SoundService.load("artists").
	then( function (res){
		$scope.artists=res.data.artists;
	});
   
})

//Artist List
controllers.controller('AlbumsListCtrl', function($scope, $http, SoundService){

	SoundService.load("albums").
	then( function (res){
		$scope.albums=res.data.albums;
	});
})


//Tracks
controllers.controller('TracksListCtrl', function($scope, $http, SoundService){

	SoundService.load("tracks").
	then( function (res){
		$scope.tracks=res.data.tracks;
	});
})

controllers.controller('PlayerCtrl', function ($scope, SoundService) {
	SoundService.loadTracks();

	$scope.play = function(artist, album, track) {
    	SoundService.play(artist, album, track);
	    console.log("playing: "+ artist +", "+album+", "+track);

	}
})

