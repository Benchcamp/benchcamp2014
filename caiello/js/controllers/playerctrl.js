"use strict";


controllers.controller('PlayerCtrl', function ($scope, $interval, SoundService) {
	SoundService.loadTracks();


	$scope.timing=0;

	//console.log("scope: "+$scope.ngTrack);
	$scope.playing=SoundService.isPlaying();


	function _update(){
		$scope.timing= SoundService.getPosition();
		$scope.currently=SoundService.currentlyPlaying();
	}
	$interval(_update, 20);


	


	$scope.play = function(artist, album, track) {
    	SoundService.play(artist, album, track);
    	//$scope.prueba="probando...";
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

