"use strict";


//Albums List Controller
controllers.controller('AlbumsListCtrl', function($scope, $http, SoundService){

	SoundService.load("albums").
	then( function (res){
		$scope.albums=res.data.albums;
	});
})

