'use strict';

/*
Services
*/

var services=angular.module("player.services", []);

//using factory matchs a key with a value func w/ret?
services.factory("SongsService", function ($http) {

	return {
		load: function(type){
			//$http.get returns a promise :)
			return $http.get("data/"+type+".json")
		}
	}
});



//i need rootscope to use apply because i cant know if the sound loads without the apply of rootscope...

services.factory("SoundJS", function ($q, $rootScope, $http) {
	
	return {
		registerTrack: function(){
			//$http.get returns a promise :)
			var defer=$q.defer();
			console.log($rootScope);

			createjs.Sound.registerSound("assets/resources/songs/emc2.ogg", "sound");

			defer.resolve()

	        console.log("despues");
		
			return defer.promise;
		},
		play: function(){
			instance = createjs.Sound.play("sound");
		    //instance.volume = 0.5;
		    console.log("playeando...");
		},
		songEnds: function(){
			console.log("song ends");
		}
	}
});
