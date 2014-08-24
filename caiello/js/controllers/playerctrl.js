"use strict";


controllers.controller('PlayerCtrl', function ($scope, $interval, SoundService) {
	SoundService.loadTracks();


	$scope.timing=0;
	$scope.timingpercent=30;
	$scope.playing=false;
	$scope.toggled=false;



	//a watcher to the playing status.. getting not binded info from controller of service..
	$scope.$watch(SoundService.isPlaying, function() { 
		$scope.playing=SoundService.isPlaying();
	});

	function _update(){
		$scope.timing= SoundService.getPosition();
		$scope.timingpercent= SoundService.getPositionPercent();
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

	$scope.toggle=function(){
		$scope.toggled=!$scope.toggled;
	}





})

