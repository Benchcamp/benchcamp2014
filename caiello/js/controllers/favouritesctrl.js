"use strict";

//Favourites Controller
controllers.controller('FavouritesCtrl', function($scope){

	$scope.favourites = {
	tracks: [
		{
			"artist": "artista",
			"album": "albumm",
			"track": "track.."
		},{
			"artist": "artista2",
			"album": "albumm2",
			"track": "track..2"
		}
	]};

  	$scope.addToFavourites = function(thingToAdd) {
		console.log(thingToAdd);
		var thing={
			"artist": thingToAdd,
			"album": thingToAdd,
			"track": thingToAdd
		};
		$scope.favourites.tracks.push(thing);
  	};




})






