'use strict';

var controllers = angular.module("player.controllers", []);/*otros modulos dependientes o requeridos*/

controllers.controller("AppCtrl", function($scope){
	$scope.nombre="Nothing Filtered";
	$scope.filterTracks= function(){
		$scope.nombre="Filter Tracks";
	}
	$scope.filterAlbums= function(){
		$scope.nombre="Filter Albums";
	}
	$scope.filterArtists= function(){
		$scope.nombre="Filter Artists";
	}
} 
);

//Artist List Service?
controllers.controller('ArtistsListCtrl', function($scope, $http){
	$scope.list;

	//returns a promise
	$http.get("assets/json/artistsv2.json").
	success( function (data){ 
		$scope.list=data.data;
		console.log(data);
	}).
	error(function(data) {
		console.log("error loading json artists");
	});
})
