"use strict";

//Artist List Controller
controllers.controller('ArtistsListCtrl', function($scope, $http){
	$scope.artists;//creo que no es necesario...

	//returns a promise
	$http.get("assets/json/artistsv2.json").
	then( function (res){
		$scope.artists=res.data.artists;
	});
})

//Artist List Service?
controllers.controller('AlbumsListCtrl', function($scope, $http){
	$scope.albums;

	//returns a promise
	$http.get("assets/json/albumsv2.json").
	then( function (res){
		$scope.albums=res.data.albums;
	});
})


//Tracks
controllers.controller('TracksListCtrl', function($scope, $http){
	$scope.tracks;

	//returns a promise
	$http.get("assets/json/songsv2.json").
	then( function (res){
		$scope.tracks=res.data.tracks;
	});
})


