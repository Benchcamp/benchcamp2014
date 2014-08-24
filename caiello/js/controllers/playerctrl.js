"use strict";


controllers.controller('PlayerCtrl', function ($scope, $interval, SoundService) {
	SoundService.loadTracks();


	$scope.timing=0;
	$scope.playing=false;



	//a watcher to the playing status.. getting info from controller of service..
	$scope.$watch(SoundService.isPlaying, function() { 
		$scope.playing=SoundService.isPlaying();
		console.log($scope.playing);
		console.log("cambio"); 
	});

	function _update(){
		$scope.timing= SoundService.getPosition();
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

