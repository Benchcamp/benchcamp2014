"use strict";


//Tracks List Controller
controllers.controller('TracksListCtrl', function($scope, $http, SoundService){

	SoundService.load("tracks").
	then( function (res){
		$scope.tracks=res.data.tracks;
	});
})

