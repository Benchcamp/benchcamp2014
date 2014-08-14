var LoadInfo = ( function () {

    //Private vars
    var urlArtists = "assets/json/artists.txt";
    var urlAlbums = "assets/json/albums.txt";
    var urlSongs = "assets/json/songs.txt";
    
    var fetchJSONFile = function(theUrl){
        var xmlHttp = null;

        xmlHttp = new XMLHttpRequest();
        xmlHttp.open( "GET", theUrl, false );
        xmlHttp.send( null );
        return JSON.parse(xmlHttp.responseText);
    };
    
    //Public vars
    return{
        artists: function () {

            var artists;

            artists = fetchJSONFile(urlArtists);
            return artists;
        },

        albums: function () {

            var albums;

            albums = fetchJSONFile(urlAlbums);
            return albums;
        },

        songs: function () {

            var songs;

            songs = fetchJSONFile(urlSongs);
            return songs;
        }
    }; 

}) ();