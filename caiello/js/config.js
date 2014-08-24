//using http://api.lyricsnmusic.com/ with a proxy from http://localhost:8888/api/
app.constant("LYRICSAPI", "http://localhost:8888/api/songs?api_key=7103d7534425de166eaac87dd37927&q=");


app.config(function ($routeProvider){
	$routeProvider
	.when("/",{controller:"AlbumsListCtrl", templateUrl:"views/albums.html"})
	.when("/albums",{controller:"AlbumsListCtrl", templateUrl:"views/albums.html"})
	.when("/artists",{controller:"ArtistsListCtrl", templateUrl:"views/artists.html"})
	.when("/tracks",{controller:"TracksListCtrl", templateUrl:"views/tracks.html"})
	.otherwise({redirectTo:"/"})
});