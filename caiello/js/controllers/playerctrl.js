"use strict";

/*
This controller controls the player, (play, pause, some vars like transcurred time), using the service SoundService (who wrapps soundjs)
*/
controllers.controller('PlayerCtrl', function ($scope, $interval, SoundService, Utilities, DragService) {
	SoundService.loadTracks();

	//player vars
	$scope.timing=0;
	$scope.timingpercent=0;
	$scope.playing=false;
	$scope.toggled=false;

	//drag vars
	$scope.xaxis = 0;
	$scope.yaxis = 0;
	$scope.dragging = false;


	//a watcher to the playing status.. getting not binded info from controller of service..
	$scope.$watch(SoundService.isPlaying, function() { 
		$scope.playing=SoundService.isPlaying();
	});

	//updates some values like time and transcurred percent time
	function _update(){
		$scope.timing= SoundService.getPosition();
		$scope.timingpercent= SoundService.getPositionPercent();
	}
	//in this interval
	$interval(_update, 20);

	//plays an artist, an album or a track
	$scope.play = function(artist, album, track) {
    	SoundService.play(artist, album, track);
	}
	//pause the actual instance
	$scope.pause = function() {
    	SoundService.pause();
	}
	//next track
	$scope.next = function() {
    	SoundService.nextTrack();
	}
	//previous track
	$scope.prev = function() {
    	SoundService.prevTrack();
	}
	//mute the sound
	$scope.mute=function(){
		SoundService.mute();
	}
	//changes repeat to no repeat and viceversa
	$scope.changeRepeat = function() {
    	SoundService.changeRepeat();
	}
	//change shuffle to no shuffle and viceversa
	$scope.changeShuffle = function() {
    	SoundService.changeShuffle();
	}
	//toggle the menu (maybe i have to create another ctrl to this..)
	$scope.toggle=function(){
		$scope.toggled=!$scope.toggled;
	}
	//changes the current playing position given a click in the transcurred time
    $scope.changePosition = function ($event) {
    	var res = Utilities.getMouseEventResult($event, "Mouse up");
    	SoundService.setPositionPercent(res.x*100.0/$event.toElement.clientWidth);

    };




    //Drag Ctrl?
	$scope.mouseDown = function($event, track) {
		//console.log("draggeando: "+track.song);
		DragService.mouseDown($event,track);
  	};

  	$scope.mouseUp = function() {
		DragService.mouseUp();
		$scope.dragging=false;
  	};

  	$scope.mouseMove = function($event) {
		var res=DragService.mouseMove($event);
		if (res!=null){
			$scope.xaxis=res.x;
			$scope.yaxis=res.y;
			$scope.dragging=true;
		}
  		
  	};





})

