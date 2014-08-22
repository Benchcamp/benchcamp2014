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




controllers.controller('PlayerCtrl', function ($scope, $interval, SoundService) {
	SoundService.loadTracks();

	$scope.timing=0;

	function _update(){
		$scope.timing= SoundService.getPosition();
	}



	$interval(_update, 20);

	$scope.play = function(artist, album, track) {
    	SoundService.play(artist, album, track);
	}

	$scope.pause = function() {
    	SoundService.pause();
	}

	$scope.next = function() {
    	SoundService.nextTrack();
	}

	$scope.prev = function() {
    	SoundService.prevTrack();
	}

	$scope.mute=function(){
		SoundService.mute();
	}

	$scope.changeRepeat = function() {
    	SoundService.changeRepeat();
	}

	$scope.changeShuffle = function() {
    	SoundService.changeShuffle();
	}

	$scope.changePosition=function(event){
		console.log(event);

	}


	


})

