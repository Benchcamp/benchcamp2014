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
	var instance;
	var registeredTracks = [];

	return {

		registerTrack: function(trackname){

			var res=function (){
				defer.resolve();
				registeredTracks[trackname]=true;
				console.log("resuelto vieja");
			}

			var defer=$q.defer();
 
			if (!registeredTracks[trackname]){
				createjs.Sound.registerSound("assets/resources/songs/emc2.ogg", trackname);

				createjs.Sound.addEventListener("fileload", res);
			}else{
				defer.resolve();
			}

			return defer.promise;
		},

		play: function(artist, album, track){
			
			this.registerTrack(track).then(
				function(){
					if (!instance)
						instance = createjs.Sound.play(track);
					console.log("registrado y playeando")
				}
			)

		    //instance.volume = 0.5;
		    console.log("playeando...");
		},

		songEnds: function(){
			console.log("song ends");
		}
	}
});
