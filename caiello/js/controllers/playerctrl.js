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
	//toggle the menu (i have to create a directive)
	$scope.toggle=function(){
		$scope.toggled=!$scope.toggled;
	}
	//changes the current playing position given a click in the transcurred time
    $scope.changePosition = function ($event) {
    	var res = Utilities.getMouseEventResult($event, "Mouse up");
    	SoundService.setPositionPercent(res.x*100.0/$event.toElement.clientWidth);

    };




    //Drag Ctrl?
	$scope.mouseDown = function($event, thing) {
		//console.log("draggeando: "+thing.artist);
		DragService.mouseDown($event,thing);
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

  	$scope.mouseUpOnDropZone=function(){
  		//console.log("droppeare");
  		var draggedThing=DragService.droppedSomething(); //if something was dropped
  		if (draggedThing){//i do something with the dragging thing
  			console.log("dropped: "+draggedThing.song);

  			SoundService.play(draggedThing.artist, draggedThing.album, draggedThing.song);
  		}

  	}




})

