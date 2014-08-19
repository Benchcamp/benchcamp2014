'use strict';

/*
Services
*/

var services=angular.module("player.services", []);

services.factory("songsservice", function ($http) {

	return {
		load: function(type){
			return $http.get("data/"+type+".json")
		}
	}
	
});