"use strict";

//Artist List Controller
controllers.controller('ArtistsListCtrl', function($scope, $http, SoundService){

	SoundService.load("artists").
	then( function (res){
		$scope.artists=res.data.artists;
	});
   
})


