"use strict";

var app=angular.module("player",["player.controllers","ngRoute"]);
var controllers = angular.module("player.controllers", []);/*otros modulos dependientes o requeridos*/


app.config(function ($routeProvider){
	$routeProvider
	.when("/",{controller:"AlbumsListCtrl", templateUrl:"partials/albums.html"})
	.when("/albums",{controller:"AlbumsListCtrl", templateUrl:"partials/albums.html"})
	.when("/artists",{controller:"ArtistsListCtrl", templateUrl:"partials/artists.html"})
	.when("/tracks",{controller:"TracksListCtrl", templateUrl:"partials/tracks.html"})
	.otherwise({redirectTo:"/"})
});

