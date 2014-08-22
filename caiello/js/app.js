"use strict";

var app=angular.module("player",["player.controllers","ngRoute", "player.services", "player.directives"]);

var controllers = angular.module("player.controllers", []);/*otros modulos dependientes o requeridos*/


app.config(function ($routeProvider){
	$routeProvider
	.when("/",{controller:"AlbumsListCtrl", templateUrl:"views/albums.html"})
	.when("/albums",{controller:"AlbumsListCtrl", templateUrl:"views/albums.html"})
	.when("/artists",{controller:"ArtistsListCtrl", templateUrl:"views/artists.html"})
	.when("/tracks",{controller:"TracksListCtrl", templateUrl:"views/tracks.html"})
	.otherwise({redirectTo:"/"})
});

