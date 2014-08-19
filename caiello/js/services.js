'use strict';

/*
Services
*/

var services=angular.module("player.services", []);

//using factory matchs a key with a value?
services.factory("SongsService", function ($http) {

	return {
		load: function(type){
			return $http.get("data/"+type+".json")
		}
	}
});

services.service("SoundJS", function () {

	var instance;




	this.registerTracks=function(){
		createjs.Sound.alternateExtensions = ["mp3"];
 		createjs.Sound.addEventListener("fileload", createjs.proxy(this.loadHandler, this));
 		createjs.Sound.registerSound("assets/resources/songs/emc2.ogg", "sound");


		console.log("Tracks Registered");
		prueba();
	}
	this.play=function(){
		instance = createjs.Sound.play("sound");
	    instance.addEventListener("complete", createjs.proxy(this.handleComplete, this));
	    instance.volume = 0.5;
	}
});
